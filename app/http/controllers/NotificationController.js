"use strict";

const eventBus = require('./../../eventbus');

class NotificationController {

  websocketHandler(ctx) {
    const {channel} = ctx.query;

    const subscription = eventBus.subscribe(channel, (event, payload) => {
      ctx.websocket.send(JSON.stringify({event, payload}));
    });

    ctx.websocket.on('close', () => {
      eventBus.unsubscribe(channel, subscription);
    });
  }
}

module.exports = NotificationController;