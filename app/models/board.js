"use strict";

const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
  name: String,
  lists: [{type:mongoose.Schema.Types.ObjectId, ref:'List'}],
});

boardSchema.set('toJSON', {versionKey:false});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;