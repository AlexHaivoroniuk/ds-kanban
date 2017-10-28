"use strict";

require('./bootstrap');

const Koa = require('koa');
const koaBody = require('koa-body');
const router = require('./http/routing');
const wsRouter = require('./http/routing/ws');
const websoketify = require('koa-websocket');

const app = websoketify(new Koa());

app.use(koaBody({
  multipart: true,
}));

app.use(router.middleware());

app.use(router.allowedMethods());

app.ws.use(wsRouter.middleware());

app.listen(3000, () => {
  console.log('Server started');
});