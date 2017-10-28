"use strict";

const {User} = require('./../../models');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const eventBus = require('./../../eventbus');

class UsersController {

  async getUsers(ctx, next) {
    const docs = await User.find();
    ctx.body = docs;
    return next()
  }

  async getUser(ctx, next) {
    const {id} = ctx.params;
    ctx.body = await User.findById(id);
    return next();
  }

  async createUser(ctx, next) {
    const user = ctx.request.body;
    const newUser = new User(user);
    const doc = await newUser.save();
    ctx.status = 201;
    ctx.body = doc;
    eventBus.emit('create.user', doc);
    return next();
  }

  async updateUser(ctx, next) {
    const data = ctx.request.body;
    const {id} = ctx.params;
    ctx.body = await User.findByIdAndUpdate(id, data, {new: true});
    eventBus.emit('update.user', ctx.body);
    return next();
  }

  async deleteUser(ctx, next) {
    const {id} = ctx.params;
    const {deletedCount} = await User.deleteOne({_id: ObjectId(id)});
    if (deletedCount === 1) {
      eventBus.emit('delete.user', {userId:id});
      ctx.status = 200;
    } else {
      ctx.status = 204;
    }
    return next();
  }
}

module.exports = UsersController;