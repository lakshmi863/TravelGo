const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const dbpath = path.join(__dirname, "register.db");

const db = new sqlite3.Database(dbpath, (err) => {
    if (err) {
        console.error(`Failed to connect to SQLite:`, err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

module.exports = db;