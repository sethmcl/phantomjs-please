'use strict';

// Dependencies
var EventEmitter = require( 'events' ).EventEmitter;

// Represents a browser that can be controlled to navigate to pages, etc.
function Browser( id, parent ){
  this.id = id;

  parent.on( 'phantom-stdout', function( out ){
    this.emit( 'stdout', out );
  }.bind( this ) );

  parent.on( 'phantom-stderr', function( err ){
    this.emit( 'stderr', err );
  }.bind( this ) );
}

// Extend Event Emitter
Browser.prototype = Object.create( EventEmitter.prototype );

// Navigate to a URL
Browser.prototype.navigate = function( url ){
  this.emit( 'navigate', { id: this.id, url: url } );
};

// Kill
Browser.prototype.kill = function(){
  this.emit( 'kill' );
};

module.exports = Browser;
Object.seal( module.exports );
