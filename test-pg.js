const { Pool } = require('pg');
require('dotenv').config();

const url = process.env.DATABASE_URL;
console.log('Testing PG connection to', url.split('@')[1] || 'db...');

const pool = new Pool({ connectionString: url, ssl: true });
pool.query('SELECT 1 as connected')
  .then(res => console.log('SUCCESS:', res.rows))
  .catch(err => console.error('FAILED:', err))
  .finally(() => pool.end());
