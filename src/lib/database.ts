import Database from 'better-sqlite3';
import { sql } from '@vercel/postgres';
import path from 'path';

let db: Database.Database | null = null;

const isProduction = process.env.NODE_ENV === 'production';

export function getDatabase() {
  if (isProduction) {
    // In production, we'll use Vercel Postgres, so return null for SQLite
    return null;
  }

  if (db) {
    return db;
  }

  const dbPath = path.join(process.cwd(), 'acts-of-service.db');
  
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

  // Create the user_ideas table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      hearts INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add hearts column to existing tables if it doesn't exist
  try {
    db.exec(`ALTER TABLE acts_of_service ADD COLUMN hearts INTEGER DEFAULT 0`);
  } catch {
    // Column might already exist, ignore error
  }

  // Add hearts column to user_ideas if it doesn't exist
  try {
    db.exec(`ALTER TABLE user_ideas ADD COLUMN hearts INTEGER DEFAULT 0`);
  } catch {
    // Column might already exist, ignore error
  }

  return db;
}

// Initialize Postgres tables in production
export async function initPostgresTables() {
  if (!isProduction) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS acts_of_service (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        hearts INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        act_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (act_id) REFERENCES acts_of_service (id) ON DELETE CASCADE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_ideas (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        hearts INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error('Error initializing Postgres tables:', error);
  }
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

export interface UserIdea {
  id: number;
  content: string;
  hearts: number;
  created_at: string;
}

export async function getAllActs(): Promise<ActOfService[]> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`SELECT * FROM acts_of_service ORDER BY created_at DESC`;
    return result.rows as ActOfService[];
  } else {
    const database = getDatabase();
    const acts = database!.prepare('SELECT * FROM acts_of_service ORDER BY created_at DESC').all();
    return acts as ActOfService[];
  }
}

export async function createAct(content: string): Promise<ActOfService> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`
      INSERT INTO acts_of_service (content, hearts) 
      VALUES (${content}, 0) 
      RETURNING *
    `;
    return result.rows[0] as ActOfService;
  } else {
    const database = getDatabase();
    const now = new Date().toISOString();
    const insert = database!.prepare('INSERT INTO acts_of_service (content, hearts, created_at) VALUES (?, 0, ?)');
    const result = insert.run(content, now);
    
    const newAct = database!.prepare('SELECT * FROM acts_of_service WHERE id = ?').get(result.lastInsertRowid);
    
    return newAct as ActOfService;
  }
}

export async function updateHearts(actId: number, hearts: number): Promise<boolean> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`UPDATE acts_of_service SET hearts = ${hearts} WHERE id = ${actId}`;
    return (result.rowCount ?? 0) > 0;
  } else {
    const database = getDatabase();
    const update = database!.prepare('UPDATE acts_of_service SET hearts = ? WHERE id = ?');
    const result = update.run(hearts, actId);
    
    return result.changes > 0;
  }
}

export async function getActById(actId: number): Promise<ActOfService | null> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`SELECT * FROM acts_of_service WHERE id = ${actId}`;
    return result.rows[0] as ActOfService || null;
  } else {
    const database = getDatabase();
    const act = database!.prepare('SELECT * FROM acts_of_service WHERE id = ?').get(actId);
    
    return act as ActOfService | null;
  }
}

export async function getCommentsByActId(actId: number): Promise<Comment[]> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`SELECT * FROM comments WHERE act_id = ${actId} ORDER BY created_at ASC`;
    return result.rows as Comment[];
  } else {
    const database = getDatabase();
    const comments = database!.prepare('SELECT * FROM comments WHERE act_id = ? ORDER BY created_at ASC').all(actId);
    
    return comments as Comment[];
  }
}

export async function createComment(actId: number, content: string): Promise<Comment> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`
      INSERT INTO comments (act_id, content) 
      VALUES (${actId}, ${content}) 
      RETURNING *
    `;
    return result.rows[0] as Comment;
  } else {
    const database = getDatabase();
    const now = new Date().toISOString();
    const insert = database!.prepare('INSERT INTO comments (act_id, content, created_at) VALUES (?, ?, ?)');
    const result = insert.run(actId, content, now);
    
    const newComment = database!.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);
    
    return newComment as Comment;
  }
}

export async function getCommentCount(actId: number): Promise<number> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`SELECT COUNT(*) as count FROM comments WHERE act_id = ${actId}`;
    return (result.rows[0] as { count: number }).count;
  } else {
    const database = getDatabase();
    const result = database!.prepare('SELECT COUNT(*) as count FROM comments WHERE act_id = ?').get(actId);
    
    return (result as { count: number }).count;
  }
}

export async function getAllUserIdeas(): Promise<UserIdea[]> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`SELECT * FROM user_ideas ORDER BY created_at DESC`;
    return result.rows as UserIdea[];
  } else {
    const database = getDatabase();
    const ideas = database!.prepare('SELECT * FROM user_ideas ORDER BY created_at DESC').all();
    return ideas as UserIdea[];
  }
}

export async function createUserIdea(content: string): Promise<UserIdea> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`
      INSERT INTO user_ideas (content, hearts) 
      VALUES (${content}, 0) 
      RETURNING *
    `;
    return result.rows[0] as UserIdea;
  } else {
    const database = getDatabase();
    const now = new Date().toISOString();
    const insert = database!.prepare('INSERT INTO user_ideas (content, hearts, created_at) VALUES (?, 0, ?)');
    const result = insert.run(content, now);
    
    const newIdea = database!.prepare('SELECT * FROM user_ideas WHERE id = ?').get(result.lastInsertRowid);
    
    return newIdea as UserIdea;
  }
}

export async function updateUserIdeaHearts(ideaId: number, hearts: number): Promise<boolean> {
  if (isProduction) {
    await initPostgresTables();
    const result = await sql`UPDATE user_ideas SET hearts = ${hearts} WHERE id = ${ideaId}`;
    return (result.rowCount ?? 0) > 0;
  } else {
    const database = getDatabase();
    const update = database!.prepare('UPDATE user_ideas SET hearts = ? WHERE id = ?');
    const result = update.run(hearts, ideaId);
    
    return result.changes > 0;
  }
}

export default db; 