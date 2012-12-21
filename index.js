'use strict';

// Dependencies
var PhantomJsPlease = require( './lib/PhantomJsPlease' );

// 'Static' instance
var instance = new PhantomJsPlease();
instance.initialize();

module.exports = function() {
  return instance.createBrowser();
};
