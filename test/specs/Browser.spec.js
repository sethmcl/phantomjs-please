var should     = require( '../lib/sinon-chai' ).chai.should(),
    sinon      = require( 'sinon' ),
    Phantom    = require( '../../lib/PhantomJsPlease' ),
    ioclient   = require( 'socket.io-client' ),
    http       = require( 'http' ),
    exec       = require( 'child_process' ).exec;

describe( 'Browser', function(){
  var phantom;

  phantom = new Phantom();
  it( 'should navigate to a page', function( done ){

    // can take a while for the phantom process to initialize
    this.timeout( 10000 );

    phantom.initialize().then( function(){
      var server, browser, port;

      server = http.createServer( function( req, res ){
        res.end('');
        done();
      });

      server.listen();

      port = server.address().port;

      browser = phantom.createBrowser();
      browser.on( 'stdout', console.log );
      browser.on( 'stderr', console.log );
      browser.navigate('http://localhost:' + port);
    });
  });

});
