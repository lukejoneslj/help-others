import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'acts-of-service.db');
const db = new Database(dbPath);

// Create the table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS acts_of_service (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface ActOfService {
  id: number;
  content: string;
  created_at: string;
}

export function getAllActs(): ActOfService[] {
  const stmt = db.prepare('SELECT * FROM acts_of_service ORDER BY created_at DESC');
  return stmt.all() as ActOfService[];
}

export function createAct(content: string): ActOfService {
  const stmt = db.prepare('INSERT INTO acts_of_service (content) VALUES (?)');
  const result = stmt.run(content);
  
  const getStmt = db.prepare('SELECT * FROM acts_of_service WHERE id = ?');
  return getStmt.get(result.lastInsertRowid) as ActOfService;
}

export default db; 