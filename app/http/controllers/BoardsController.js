"use strict";

const {Board} = require('./../../models');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const eventBus = require('./../../eventbus');

class BoardsController {

  async getBoards (ctx, next) {
    ctx.body = await Board.find();
    ctx.status = 200;
    return next()
  }

  async getBoard (ctx, next) {
    const {id} = ctx.params;
    ctx.body = await Board.findById(id).populate('lists');
    return next();
  }

  async createBoard(ctx, next) {
    const board = ctx.request.body;
    const newBoard = new Board(board);
    const doc = await newBoard.save();
    ctx.status = 201;
    ctx.body = doc;
    eventBus.emit('new.board', doc);
    return next();
  }

  async updateBoard(ctx, next) {
    const data = ctx.request.body;
    const {id} = ctx.params;
    ctx.body = await Board.findByIdAndUpdate(id, data, {new: true});
    eventBus.emit('update.board', ctx.body);
    return next();
  }

  async deleteBoard(ctx, next) {
    const {id} = ctx.params;
    const {deletedCount} = await Board.deleteOne({_id: ObjectId(id)});
    if (deletedCount === 1) {
      ctx.status = 200;
      eventBus.emit('delete.board', {boardId:id});
    } else {
      ctx.status = 204;
    }
    return next();
  }
}

module.exports = BoardsController;