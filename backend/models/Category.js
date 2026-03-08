const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:   { type: String, required: true, unique: true, trim: true },
  slug:   { type: String, required: true, unique: true, lowercase: true },
  image:  { public_id: String, url: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
