"use strict";

const crypto = require('crypto');

/**
 * @param {string} value
 * @return {string}
 */
module.exports = (value) => {
 const hash = crypto.createHash('md5');
 hash.update(value);
 return hash.digest('hex')
};