"use strict";

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  email: String,
});

userSchema.set('toJSON', {versionKey: false});

const User = mongoose.model('User', userSchema);

module.exports = User;