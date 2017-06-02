var bcrypt = require( 'bcrypt' );
var SALT_WORK_FACTOR = 10;

// API to encrypt the users password and compare incoming password to stored
var passwordServices = {
  encryptPassword: function ( userPassword ) {
    var salt = bcrypt.genSaltSync( SALT_WORK_FACTOR );
    return bcrypt.hashSync( userPassword, salt );
  },
  comparePassword: function ( inboundPassword, storedPassword ) {
    console.log( 'compare incoming password:', inboundPassword, storedPassword );
    return bcrypt.compareSync( inboundPassword, storedPassword );
  }
}; // end passwordServices

module.exports = passwordServices;
