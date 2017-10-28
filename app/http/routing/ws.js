"use strict";

const Router = require('koa-router');
const router = new Router();
const {NotificationController} = require('./../controllers');

const notificationController = new NotificationController();

router.all('/notify/ws', notificationController.websocketHandler);

module.exports = router;