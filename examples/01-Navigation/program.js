var Phantom = require( '../../index' );
var browser = Phantom();

browser.on( 'stdout', function( out ){
  console.log( 'stdout:', out );
});

browser.on( 'stderr', function( err ){
  console.log( 'stderr:', err );
});

browser.navigate( 'http://www.linkedin.com' );
