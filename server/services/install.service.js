const db = require('../config/db.config')
const fs = require('fs');
const path = require('path');

async function install() {
    const queryFile = path.join(__dirname, '..', 'sql', 'initial-queries.sql');

    let queries = [];
    let finalMessage = {}; 
    let tempLine = '';

    const fileContent = fs.readFileSync(queryFile, 'utf-8');
    const lines = fileContent.split('\n');

    
    lines.forEach((line) => {
        line = line.trim();

        if (line.startsWith('--') || line === '') {
            return;
        }

        tempLine += line + ' ';

        if (line.endsWith(';')) {
            queries.push(tempLine.trim());
            tempLine = '';
        }
    });

   
    for (let i = 0; i < queries.length; i++) {
        try {
            await db.query(queries[i]);
            console.log('Query executed successfully');
        } catch (err) {
            console.error('Error executing query:', err.message);
            finalMessage.message = 'Not all tables are created';
        }
    }

    if (!finalMessage.message) {
        finalMessage.message = 'All tables are created';
        finalMessage.status = 200;
    } else {
        finalMessage.status = 500;
    }

    return finalMessage;
}

module.exports = { install };
