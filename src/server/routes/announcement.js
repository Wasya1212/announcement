const Router = require('koa-router');
const Busboy = require('busboy');
const AsyncBusboy = require('async-busboy');

const { mongoose } = require('../middleware/mongoose');

const Cloudinary = require('../libs/cloudinary');

const { Announcement } = require('../models');

const fs = require('fs');
const path = require('path');

const router = new Router();

const KEY_FIELDS_FROM_CLIENT_FOR_CREATION = [
  'title',
  'description',
  'totalPrice',
  'category'
];

const KEY_FIELDS_FOR_SEARCH = [
  'id',
  'title'
];

const ALLOWABLE_SEARCH_FIELDS_FOR_CLIENT = {
  id: '$_id',
  date: '$createdAt',
  title: true,
  description: true,
  category: true,
  totalPrice: true,
  viewsCount: true,
  imageUrls: true,
  _id: false
};

const MAX_SEARCH_ITEMS_LIMIT = 20;
const MAX_TOP_SIMMILAR_SEARCH_ITEMS_LIMIT = 5;

router.get('/announcement', async (ctx) => {
  let query = checkQueryFields(KEY_FIELDS_FOR_SEARCH, ctx.request.query);
  if (query.id) {
    query._id = mongoose.Types.ObjectId(query.id);
    delete query.id;
  }

  if (query._id && !mongoose.Types.ObjectId.isValid(query._id)) {
    ctx.throw(400, "Bad request!");
  }

  const itemsLimit = ctx.request.query.limit && ctx.request.query.limit <= MAX_SEARCH_ITEMS_LIMIT
    ? +ctx.request.query.limit
    : MAX_SEARCH_ITEMS_LIMIT;

  ctx.body = await Announcement.aggregate([
    { $match: query },
    { $project: ALLOWABLE_SEARCH_FIELDS_FOR_CLIENT },
    { $sort: { date: -1 } },
    { $skip: Math.abs((+ctx.request.query.page - 1 || 0) * itemsLimit) },
    { $limit: itemsLimit }
  ]);
});

router.get('/announcement/count', async (ctx) => {
  let query = checkQueryFields(KEY_FIELDS_FOR_SEARCH, ctx.request.query);
  ctx.body = await Announcement.find(query).countDocuments();
});

router.get('/announcement/top/:id', async (ctx) => {
  const currentAnnouncement = (await Announcement.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(ctx.request.params.id) } },
    { $project: Object.assign({ keywords: true }, ALLOWABLE_SEARCH_FIELDS_FOR_CLIENT) },
    { $limit: 1 }
  ]))[0];

  const itemsLimit = ctx.request.query.limit && ctx.request.query.limit <= MAX_TOP_SIMMILAR_SEARCH_ITEMS_LIMIT
    ? +ctx.request.query.limit
    : MAX_TOP_SIMMILAR_SEARCH_ITEMS_LIMIT;

  const keywordsQuery = currentAnnouncement.keywords.map(keyword => ({ keywords: keyword }));

  const similarAnnouncements = await Announcement.aggregate([
    {
      $match: keywordsQuery.length > 0
        ? { $or: keywordsQuery, _id: { $ne: mongoose.Types.ObjectId(ctx.request.params.id) } }
        : { _id: { $ne: mongoose.Types.ObjectId(ctx.request.params.id) } }
    },
    { $project: ALLOWABLE_SEARCH_FIELDS_FOR_CLIENT },
    { $sort: { viewsCount: -1 } },
    { $limit: itemsLimit }
  ]);

  delete currentAnnouncement.keywords;

  ctx.body = { currentAnnouncement, similarAnnouncements };
});

router.post('/announcement', async (ctx, next) => {
  if (!compareBodyFields(KEY_FIELDS_FROM_CLIENT_FOR_CREATION, ctx.request.body)) {
    ctx.throw(400, "Bad request!");
  }

  const query = {
    title: ctx.request.body.title.trim(),
    description: ctx.request.body.description.trim(),
    totalPrice: +ctx.request.body.totalPrice,
    category: ctx.request.body.category.trim(),
    imageUrls: await uploadImagesToCloudinary(ctx.request.files),
    author: `User-${Date.now()}`,
    viewsCount: 0,
    keywords: findKeyWords(ctx.request.body.title, ctx.request.body.description)
  };

  const newAnnouncement = await Announcement.create(query);

  ctx.body = newAnnouncement;
  await next();
});

router.post('/announcement/watch', async (ctx, next) => {
  await Announcement.findByIdAndUpdate(ctx.request.body.id, { $inc: { viewsCount: 1 } });

  ctx.status = 200;
  ctx.body = true;
  await next();
});

router.put('/announcement/:id', async (ctx, next) => {
  let uploadedImages = await uploadImagesToCloudinary(ctx.request.files);
  let currentImages = [];

  try {
    currentImages = JSON.parse(ctx.request.body.oldPictures);
  } catch (err) {}

  const query = {
    title: ctx.request.body.title.trim(),
    description: ctx.request.body.description.trim(),
    totalPrice: +ctx.request.body.totalPrice,
    category: ctx.request.body.category.trim(),
    imageUrls: [...currentImages, ...uploadedImages],
    keywords: findKeyWords(ctx.request.body.title, ctx.request.body.description)
  };

  const updatedAnnouncement = await Announcement.findByIdAndUpdate(ctx.request.params.id, query);

  ctx.body = updatedAnnouncement;
  await next();
});

router.delete('/announcement/:id', async (ctx) => {
  await Announcement.findByIdAndRemove(ctx.request.params.id);

  ctx.status = 200;
  ctx.body = {};
});

module.exports = router;

function findKeyWords(text1, text2) {
  const splitedText1 = text1.trim().split(" "),
        splitedText2 = text2.trim().split(" ");

  let [t1, t2] = splitedText1.length < splitedText2.length ? [splitedText1, splitedText2] : [splitedText2, splitedText1];

  return t1.filter(word => t2.includes(word));
}

function checkQueryFields(neededFields, currentQuery) {
  let result = Object.create(null);

  neededFields.forEach(k => {
    if (currentQuery[k]) {
      result[k] = currentQuery[k];
    }
  });

  return result;
}

function compareBodyFields(neededFields, currentFields) {
  const keyFieldsIncludeMap = neededFields.map(k => !!currentFields[k]).toString();
  const trueKeyFieldsIncludeMap = new Array(neededFields.length).fill(true).toString();

  return keyFieldsIncludeMap == trueKeyFieldsIncludeMap;
}

async function uploadImagesToCloudinary(requestFiles = {}) {
  const filesKeys = Object.keys(requestFiles);
  let uploadedImages = [];

  for (let i = 0; i < filesKeys.length; i++) {
    const img = await Cloudinary.uploadImage(requestFiles[filesKeys[i]].path)
    uploadedImages.push(img.secure_url);
  }

  filesKeys.forEach((file, i) => {
    fs.unlink(requestFiles[file].path, (err) => {
      if (err) { console.error(err); }
    });
  });

  return uploadedImages;
}
