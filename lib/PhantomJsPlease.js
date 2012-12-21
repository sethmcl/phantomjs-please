'use strict';
// Dependencies
var http         = require( 'http' ),
    io           = require( 'socket.io' ),
    path         = require( 'path' ),
    fs           = require( 'fs' ),
    Deferred     = require( 'promised-io/promise' ).Deferred,
    child        = require( 'child_process' ),
    Browser      = require( './Browser'),
    EventEmitter = require( 'events' ).EventEmitter;

// PhantomJsPlease
function PhantomJsPlease() {}
PhantomJsPlease.prototype = Object.create( EventEmitter.prototype );

// Initialize
PhantomJsPlease.prototype.initialize = function( config ){
  var deferred = new Deferred();

  this.commandQueue   = [];
  this.running        = false;
  this.browsers       = {};
  this.nextBrowserId  = 1;

  this.httpServer     = this.createHttpServer();
  this.socketServer   = this.createSocketServer( this.httpServer.listen() );
  this.port           = this.httpServer.address().port;
  this.phantomProcess = this.createPhantomProcess( {
   script: path.resolve( __dirname, 'PhantomClient.js' ),
   port: this.port
  });

  // Pause, to allow everything to start
  setTimeout( (function(){
    deferred.resolve();
    this.running = true;
    this.flushCommandQueue();
  }).bind( this ), 500 );

  return deferred;
};

// Create HTTP Server
PhantomJsPlease.prototype.createHttpServer = function( config ){
  var httpServer, htmlPath, html;

  htmlPath   = path.resolve( __dirname, '..', 'html', 'PhantomJsPlease.html' );
  html       = fs.readFileSync( htmlPath ).toString();

  httpServer = http.createServer( function( request, response ){
    response.writeHead( 200, { 'Content-Type': 'text/html' } );
    response.end( html );
  });

  return httpServer;
}

// Create Socket.io Server
PhantomJsPlease.prototype.createSocketServer = function( config ){
  var server = io.listen( config );

  server.sockets.on( 'connection', function( socket ){
    socket.on( 'command', function( data ){
    });
  });

  return server;
};

// Send a command to PhantomJS
PhantomJsPlease.prototype.sendCommand = function( command, params ){

  if( this.running ){
    this.socketServer.sockets.emit( 'command', {
      name: command,
      params: params
    });
  }else{
    this.commandQueue.push( { command: command, params: params } );
  }
}

// Flush command queue
PhantomJsPlease.prototype.flushCommandQueue = function(){
  this.commandQueue.forEach( function( command ){
    this.sendCommand( command.command, command.params );
  }, this);

  this.commandQueue = [];
};

// Launch Phantom
PhantomJsPlease.prototype.createPhantomProcess = function( config ){
  var process, phantomBinaryPath, phantomScript, port;

  phantomBinaryPath = config.phantomBinaryPath || 'phantomjs';
  phantomScript     = config.script;
  port              = config.port;
  process           = child.spawn( phantomBinaryPath, [ phantomScript, port ] );

  process.stdout.on( 'data', this.onPhantomStdout.bind( this ) );
  process.stderr.on( 'data', this.onPhantomStderr.bind( this ) );

  return process;
};

// Handle Phantom stdout
PhantomJsPlease.prototype.onPhantomStdout = function( data ){
  this.emit( 'phantom-stdout', data.toString() );
};

// Handle Phantom stderr
PhantomJsPlease.prototype.onPhantomStderr = function( data ){
  this.emit( 'phantom-stderr', data.toString() );
};

// Create a "Browser", the interface used to load web pages, etc.
PhantomJsPlease.prototype.createBrowser = function(){
  var browser = new Browser( this.getNextBrowserId(), this );

  this.browsers[ browser.id ] = browser;
  this.sendCommand( 'create-browser', { id: browser.id } );

  // Navigate
  browser
    .on( 'navigate', (function( event ){
    this.sendCommand( 'navigate', event );
    })
    .bind(this) );

  return browser;
};

// Generate browser ID
PhantomJsPlease.prototype.getNextBrowserId = function(){
  return this.nextBrowserId++;
};

module.exports = PhantomJsPlease;
Object.seal(module.exports);
