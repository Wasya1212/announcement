const { Schema, Model, Types } = require('../middleware/mongoose');

const announcementSchema = new Schema({
  imageUrls: [{ required: false, type: Types.Url }],
  title: { required: true, type: Types.String },
  description: { required: true, type: Types.String },
  author: { required: false, type: Types.String },
  viewsCount: { required: true, type: Types.Number, default: 0 },
  keywords: [{ required: false, type: Types.String }],
  category: { required: true, type: Types.String, trim: true },
  totalPrice: { required: true, type: Types.Number, default: 0 }
}, { timestamps: true });

const announcementModel = new Model('Announcement', announcementSchema);

module.exports = announcementModel.create();
