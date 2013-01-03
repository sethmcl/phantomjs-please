'use strict';

// Dependencies
var PhantomJsPlease = require( './lib/PhantomJsPlease' );

// 'Static' instance
var instance = new PhantomJsPlease();

// Setup instance
module.exports.setup = function( config ){
  if( !instance.initialized ){
    instance.initialize( config );
  }
};

// Create a new browser
module.exports.createBrowser = function( phantomBinaryPath ) {
  return instance.createBrowser();
};
