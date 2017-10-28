"use strict";

const {EventEmitter2} = require('eventemitter2');

class EventBus extends EventEmitter2 {

  constructor() {
    super({wildcard: true});
    this._subscribers = {}
  }

  subscribe(event, listener) {
    if (!(event in this._subscribers)) {
      this._subscribers[event] = [];
      this.on(event, this._notify.bind(this, event))
    }
    const newLength = this._subscribers[event].push(listener);
    return newLength - 1;
  }

  unsubscribe(event, subscriptionId) {
    this._subscribers[event].splice(subscriptionId, 1);
    if (this._subscribers[event].length === 0) {
      this.removeAllListeners(event);
      delete this._subscribers[event];
    }
  }

  _notify(event, ...payload) {
    this._subscribers[event].forEach(listener => listener.apply(this, [this.event, ...payload]));
  }

}

const eventBus = new EventBus();

module.exports = eventBus;