"use strict";

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  name: String,
  priority: Number,
  content: String,
  assignTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  listId: {type: mongoose.Schema.Types.ObjectId, ref: 'List'},
  attachments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Attachment'}],
});

taskSchema.set('toJSON', {versionKey: false});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;