"use strict";

const {Attachment} = require('./../../models');
const config = require('config');
const fse = require('fs-extra');
const nodePath = require('path');
const md5 = require('./../../helpers/md5');
const eventBus = require('./../../eventbus');

class AttachmentsController {
  constructor() {
    this.ensureStorageDir();
  }

  async ensureStorageDir() {
    await fse.ensureDir(nodePath.resolve(config.fileStorageRoot));
  }

  async upload(ctx, next) {
    const {attachment: file} = ctx.request.body.files;
    const {name, type} = file;
    const hash = md5(name);
    const path = this.pathByHash(hash);
    const attachmentData = {
      hash,
      name,
      type,
      upload: Date.now(),
    };
    await fse.move(file.path, path, {overwrite: true});
    ctx.body = await Attachment.findOneAndUpdate({hash}, attachmentData, {new: true, upsert: true});
    eventBus.emit('attachment.upload', ctx.body);
    return next();
  }

  async download(ctx, next) {
    const {id} = ctx.params;
    const attachment = await Attachment.findById(id);
    if (attachment) {
      const {hash, name, type} = attachment;
      ctx.set(`Content-Type`, type);
      ctx.set(`Content-Disposition`, `attachment; filename=${name}`);
      ctx.body = fse.createReadStream(this.pathByHash(hash));
    } else {
      ctx.status= 204;
    }
    return next();
  }

  async del(ctx, next) {
    const {id} = ctx.params;
    const doc = await Attachment.findByIdAndRemove(id);
    ctx.body = doc;
    if (doc) {
      await fse.remove(this.pathByHash(doc.hash));
    }
    return next();
  }

  pathByHash(hash) {
    return nodePath.resolve(
      config.fileStorageRoot,
      hash.substr(30, 2),
      hash.substr(28, 2),
      hash
    )
  }
}

module.exports = AttachmentsController;