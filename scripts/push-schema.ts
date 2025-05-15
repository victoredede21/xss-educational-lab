import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('Connecting to database...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('Pushing schema to database...');
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS hooked_browsers (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL UNIQUE,
        ip_address TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        browser TEXT,
        browser_version TEXT,
        os TEXT,
        platform TEXT,
        is_online BOOLEAN DEFAULT TRUE,
        first_seen TIMESTAMP DEFAULT NOW(),
        last_seen TIMESTAMP DEFAULT NOW(),
        page_url TEXT,
        domain TEXT,
        port INTEGER,
        cookies TEXT,
        local_storage TEXT,
        referer TEXT,
        headers JSONB
      );
      
      CREATE TABLE IF NOT EXISTS command_modules (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        icon TEXT NOT NULL,
        code TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS command_executions (
        id SERIAL PRIMARY KEY,
        browser_id INTEGER NOT NULL,
        module_id INTEGER NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW(),
        result JSONB,
        status TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        browser_id INTEGER,
        timestamp TIMESTAMP DEFAULT NOW(),
        event TEXT NOT NULL,
        details JSONB,
        level TEXT NOT NULL
      );
    `);
    
    console.log('Schema pushed successfully');
  } catch (error) {
    console.error('Error pushing schema:', error);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Error in main function:', err);
  process.exit(1);
});