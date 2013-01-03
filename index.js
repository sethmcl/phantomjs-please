'use strict';

// Dependencies
var PhantomJsPlease = require( './lib/PhantomJsPlease' );

// 'Static' instance
var instance = new PhantomJsPlease();

module.exports = function() {

  if( !instance.initialized ){
    instance.initialize();
  }

  return instance.createBrowser();
};
