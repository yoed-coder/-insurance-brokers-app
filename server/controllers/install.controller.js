const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db.config');

async function install() {
  try {
    const filePath = path.join(__dirname, '../sql/initial-queries.sql');
    const sqlScript = fs.readFileSync(filePath, 'utf8');

    // Split queries by semicolon (but ignore semicolons inside definitions or strings)
    const queries = sqlScript
      .split(/;\s*$/gm)
      .map(q => q.trim())
      .filter(q => q.length > 0);

    let executedCount = 0;

    for (const query of queries) {
      try {
        await pool.query(query);
        executedCount++;
      } catch (err) {
        console.warn(`⚠️ Skipped query due to error:\n${query}\nError: ${err.message}\n`);
        // Don't throw — continue with next query
      }
    }

    return {
      status: 200,
      message: `✅ Install complete: ${executedCount} queries executed.`
    };
  } catch (err) {
    console.error('❌ Install failed:', err);
    return {
      status: 500,
      message: 'Install failed',
      error: err.message
    };
  }
}

module.exports = { install };
