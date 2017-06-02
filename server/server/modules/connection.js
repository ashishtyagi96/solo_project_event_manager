var connectionString = '';

// setup connection to DB
if( process.env.DATABASE_URL !== undefined ) {
    connectionString = process.env.DATABASE_URL + "?ssl=true";
} else {
    connectionString = 'postgres://localhost:5432/EventFull';
} // end if else

module.exports = connectionString;
