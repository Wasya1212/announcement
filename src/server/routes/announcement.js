const Router = require('koa-router');
const Busboy = require('busboy');
const AsyncBusboy = require('async-busboy');

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

module.exports = router;

function findKeyWords(text1, text2) {
  const splitedText1 = text1.trim().split(" "),
        splitedText2 = text2.trim().split(" ");

  let [t1, t2] = splitedText1.length < splitedText2.length ? [splitedText1, splitedText2] : [splitedText2, splitedText1];

  return t1.filter(word => t2.includes(word));
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
