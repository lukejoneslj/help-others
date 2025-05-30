import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase() {
  if (db) {
    return db;
  }

  const dbPath = path.join(process.cwd(), 'acts_of_service.db');
  
  db = new Database(dbPath);

  // Create the acts table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS acts_of_service (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      hearts INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create the comments table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      act_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (act_id) REFERENCES acts_of_service (id) ON DELETE CASCADE
    )
  `);

  // Add hearts column to existing tables if it doesn't exist
  try {
    db.exec(`ALTER TABLE acts_of_service ADD COLUMN hearts INTEGER DEFAULT 0`);
  } catch {
    // Column might already exist, ignore error
  }

  return db;
}

export interface ActOfService {
  id: number;
  content: string;
  hearts: number;
  created_at: string;
}

export interface Comment {
  id: number;
  act_id: number;
  content: string;
  created_at: string;
}

export function getAllActs(): ActOfService[] {
  const database = getDatabase();
  const acts = database.prepare('SELECT * FROM acts_of_service ORDER BY created_at DESC').all();
  return acts as ActOfService[];
}

export function createAct(content: string): ActOfService {
  const database = getDatabase();
  const insert = database.prepare('INSERT INTO acts_of_service (content, hearts) VALUES (?, 0)');
  const result = insert.run(content);
  
  const newAct = database.prepare('SELECT * FROM acts_of_service WHERE id = ?').get(result.lastInsertRowid);
  
  return newAct as ActOfService;
}

export function updateHearts(actId: number, hearts: number): boolean {
  const database = getDatabase();
  const update = database.prepare('UPDATE acts_of_service SET hearts = ? WHERE id = ?');
  const result = update.run(hearts, actId);
  
  return result.changes > 0;
}

export function getActById(actId: number): ActOfService | null {
  const database = getDatabase();
  const act = database.prepare('SELECT * FROM acts_of_service WHERE id = ?').get(actId);
  
  return act as ActOfService | null;
}

export function getCommentsByActId(actId: number): Comment[] {
  const database = getDatabase();
  const comments = database.prepare('SELECT * FROM comments WHERE act_id = ? ORDER BY created_at ASC').all(actId);
  
  return comments as Comment[];
}

export function createComment(actId: number, content: string): Comment {
  const database = getDatabase();
  const insert = database.prepare('INSERT INTO comments (act_id, content) VALUES (?, ?)');
  const result = insert.run(actId, content);
  
  const newComment = database.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);
  
  return newComment as Comment;
}

export function getCommentCount(actId: number): number {
  const database = getDatabase();
  const result = database.prepare('SELECT COUNT(*) as count FROM comments WHERE act_id = ?').get(actId);
  
  return (result as { count: number }).count;
} 