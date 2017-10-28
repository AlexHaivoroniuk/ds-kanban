"use strict";

const {List, Board} = require('./../../models');
const eventBus = require('./../../eventbus');

class ListsController {

  async getLists(ctx, next) {
    const {boardId} = ctx.params;
    ctx.body = await List.find({boardId});
    return next()
  }

  async getList(ctx, next) {
    const {boardId, listId} = ctx.params;
    ctx.body = await List.findOne({_id: listId, boardId}).populate('tasks');
    return next();
  }

  async createList(ctx, next) {
    const {boardId} = ctx.params;
    const listData = ctx.request.body;
    const newList = new List(Object.assign({boardId}, listData));
    const [doc, board] = await Promise.all([newList.save(), Board.findById(boardId)]);
    board.lists.push(doc._id);
    await board.save();
    ctx.body = doc;
    eventBus.emit('create.list', doc);
    return next();
  }

  async updateList(ctx, next) {
    const {boardId, listId} = ctx.params;
    const listData = ctx.request.body;
    ctx.body = await List.findOneAndUpdate({_id: listId, boardId}, listData, {new: true});
    eventBus.emit('update.list', ctx.body);
    return next();
  }

  async deleteList(ctx, next) {
    const {boardId, listId} = ctx.params;
    const {deletedCount} = await List.deleteOne({_id: listId, boardId});
    if (deletedCount === 1) {
      await Board.findOneAndUpdate({_id: boardId}, {$pull: {lists: {$in: [listId]}}}, {new:true});
      eventBus.emit('delete.list', {listId});
      ctx.status = 200;
    } else {
      ctx.status = 204;
    }
    return next();
  }

}

module.exports = ListsController;