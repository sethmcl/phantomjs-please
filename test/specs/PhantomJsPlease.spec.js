var should     = require( '../lib/sinon-chai' ).chai.should(),
    sinon      = require( 'sinon' ),
    Phantom    = require( '../../lib/PhantomJsPlease' ),
    ioclient   = require( 'socket.io-client' ),
    shttp      = require( '../../lib/shttp/shttp' ),
    exec       = require( 'child_process' ).exec;

describe( 'PhantomJS -- Please!', function(){
  var phantom;

  phantom = new Phantom();
  phantom.initialize();

  it( 'should start http server', function( done ){
    shttp.get( 'http://localhost:' + phantom.port ).then( function( response ){
      response.status.should.be.eql( 200 );
      done();
    });
  });

  it( 'should start socket.io server', function( done ){
    var socket, state;

    socket = ioclient.connect( 'http://localhost', { port: phantom.port } );
    state  = socket.socket;

    checkStatus();

    function checkStatus() {
      if( state.connecting ) {
        setTimeout( checkStatus, 50 );
        return;
      }

      state.connected.should.be.true;
      done();
    }
  });

  it( 'should start phantom process', function(){
    should.exist( phantom.phantomProcess.pid );
  });

  it( 'should generate browser ids', function(){
    phantom.getNextBrowserId().should.eql( 1 );
    phantom.getNextBrowserId().should.eql( 2 );
    phantom.getNextBrowserId().should.eql( 3 );
  });

  it( 'should send commands', function( done ){
    var socket, state;

    socket = ioclient.connect( 'http://localhost', { port: phantom.port } );
    phantom.sendCommand( 'navigate', {} );
    socket.on( 'command', function( event ){
      done();
    });
  });

  it( 'should be killed', function( done ){
    phantom.phantomProcess.on( 'exit', function(){
      done();
    });

    phantom.killPhantomProcess();
  });

  // describe( 'Browsers', function() {
    // it( 'should create a browser', function(){
      // var browser = phantom.createBrowser();
      // browser.navigate('http://www.linkedin.com');
    // });
  // });

});
