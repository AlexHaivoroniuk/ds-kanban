"use strict";

const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
  name: String,
  boardId: {type:mongoose.Schema.Types.ObjectId, ref:'Board'},
  tasks: [{type:mongoose.Schema.Types.ObjectId, ref:'Task'}],
});

listSchema.set('toJSON', {versionKey:false});

const List = mongoose.model('List', listSchema);

module.exports = List;