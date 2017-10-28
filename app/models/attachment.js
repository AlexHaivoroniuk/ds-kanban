"use strict";

const mongoose = require('mongoose');

const attachmentSchema = mongoose.Schema({
  hash: String,
  type: String,
  name: String,
  upload: Date,
});

attachmentSchema.set('toJSON', {versionKey: false});

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;