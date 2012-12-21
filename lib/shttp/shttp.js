var http = require( 'http' ),
    Deferred = require( 'promised-io/promise' ).Deferred;

function SHttp(){}

SHttp.prototype.get = function( url ){
  var deferred, responseBody;

  responseBody = [];
  deferred     = new Deferred();

  http.get( url, function( res ){
    res.on( 'error', function( e ){
      deferred.reject( e );
    });

    res.on( 'data', function( chunk ){
      responseBody.push( chunk );
    });

    res.on( 'end', function(){
      deferred.resolve( {
        body: responseBody.join( '' ),
        status: res.statusCode,
        headers: res.headers
      });
    });
  });

  return deferred.promise;
}

module.exports = new SHttp();
