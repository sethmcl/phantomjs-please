var webpage = require( 'webpage' ),
    supportedCommands,
    pages,
    port,
    proxy,
    version;

version = phantom.version.major + '.' + phantom.version.minor + '.' + phantom.version.patch;
console.log( 'Using PhantomJS', version );
initialize();

// Initialize
function initialize(){
  supportedCommands = {};
  pages = {};
  port  = phantom.args[0];
  proxy = webpage.create();
  proxy.onAlert = unpackCommand;
  proxy.open( 'http://127.0.0.1:' + this.port, function( status ){} );
  registerCommands();
};

// Browser Command
function browserCommand( params, executeCommand ){
  var page = pages[ params.id ];
  return function() {
    executeCommand();
  };
}

// Register supported commands
function registerCommands(){
  supportedCommands = {
    'create-browser': function( params ){
      pages[ params.id ] = webpage.create();
    },

    'navigate': function( params ){
      var page = pages[ params.id ],
          url  = params.url;

      page.open( url, function( status ){
        console.log(status, url, 'loaded');
      });
    }
  };
}

// Unserialize a command
function unpackCommand( commandJson ){
  var command;

  try{
    command = JSON.parse( commandJson );
  }catch(e){
    console.error( 'Invalid command: ' + commandJson );
  }

  console.log( commandJson );
  execute( command );
};

// Execute command
function execute( command ){
  var commandName, commandParams, executeFunction;

  commandName     = command.name;
  commandParams   = command.params;
  executeFunction = supportedCommands[ commandName ];

  if( typeof executeFunction !== 'function' ){
    console.error( commandName, 'is not supported' );
    return;
  }

  executeFunction( commandParams );
}
