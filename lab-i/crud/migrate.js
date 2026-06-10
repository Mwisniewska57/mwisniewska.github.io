const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.resolve(__dirname, 'data.db');
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS movie (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    director TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Migracja zakończona – tabela "movie" gotowa.');
db.close();