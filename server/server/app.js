var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var port = process.env.PORT || 3000;

app.use( express.static( 'server/public' ) );

app.get( '/*', function( req, res ) {
  res.sendFile( path.resolve( 'server/public/views/index.html' ) );
}); // end base GET

app.listen( port, function() {
  console.log( 'Event Manager running on port:', port );
}); // end app.listen
