const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool with fallback values
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'perfume_db',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('⚠️ Database connection error:', err.message);
  } else {
    console.log('✅ PostgreSQL database connected successfully at:', res.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
