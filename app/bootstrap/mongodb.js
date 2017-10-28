"use strict";

const mongoose = require('mongoose');
const config = require('config');
const {url} = config.database.mongodb;

mongoose.Promise = Promise;

mongoose.connect(url)
  .catch((err) => {
    console.error('Failed to open Mongodb Connection: ', err.message);
    process.exit(1);
  });