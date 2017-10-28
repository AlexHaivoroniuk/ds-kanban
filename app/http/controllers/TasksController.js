"use strict";

const {List, Task} = require('./../../models');
const eventBus = require('./../../eventbus');

class TasksController {

  async getTasks(ctx, next) {
    const {listId} = ctx.params;
    ctx.body = await Task.find({listId});
    return next();
  }

  async getTask(ctx, next) {
    const {listId, taskId} = ctx.params;
    ctx.body = await Task.findOne({_id: taskId, listId}).populate([{path:'author'},{path:'assignTo'}, {path:'attachments'}]);
    return next();
  }

  async createTask(ctx, next) {
    const {listId} = ctx.params;
    const taskData = ctx.request.body;
    const newTask = new Task(Object.assign({listId}, taskData));
    const [doc, list] = await Promise.all([newTask.save(), List.findById(listId)]);
    list.tasks.push(doc._id);
    await list.save();
    ctx.body = doc;
    eventBus.emit('create.task', doc);
    return next();
  }

  async updateTask(ctx, next) {
    const {listId, taskId} = ctx.params;
    const taskData = ctx.request.body;
    ctx.body = await Task.findOneAndUpdate({_id: taskId, listId}, taskData, {new: true});
    eventBus.emit('update.task', ctx.body);
    return next();
  }

  async deleteTask(ctx, next) {
    const {listId, taskId} = ctx.params;
    const {deletedCount} = await Task.deleteOne({_id: taskId, listId});
    if (deletedCount === 1) {
      await List.findOneAndUpdate({_id: listId}, {$pull: {lists: {$in: [taskId]}}}, {new: true});
      eventBus.emit('delete.task', {taskId});
      ctx.status = 200;
    } else {
      ctx.status = 204;
    }
    return next();
  }

}

module.exports = TasksController;