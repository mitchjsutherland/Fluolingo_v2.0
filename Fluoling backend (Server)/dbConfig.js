// require("dotenv").config();

// const { Pool } = require("pg");

// const isProduction = process.env.NODE_ENV === "production";

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// //initialise new pool varaiable

// const pool = new Pool({

//     connectionString: isProduction ? process.env.DATABASE_URL : connectionString

// });

// module.exports = { pool };

const { Pool } = require('pg');
require('dotenv').config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;
const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: PGPORT,
  ssl: {
    require: true,
  },
});

module.exports  = {pool};