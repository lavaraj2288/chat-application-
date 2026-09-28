const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const mongoose = require('mongoose');

let dbInstance = null;
let isMongoMode = false;

function isMongoConnected() {
  return isMongoMode && mongoose.connection.readyState === 1;
}

async function getDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri || process.env.DB_TYPE === 'mongodb') {
    if (mongoose.connection.readyState === 1) {
      isMongoMode = true;
      return mongoose.connection;
    }

    try {
      console.log(`[Database] Connecting to MongoDB Atlas...`);
      await mongoose.connect(mongoUri);
      isMongoMode = true;
      console.log(`[Database] MongoDB Atlas connected successfully.`);

      // Ensure Vedaz company official group document exists in MongoDB
      const UserModel = require('../models/mongo/UserModel');
      await UserModel.findOneAndUpdate(
        { id: 'vedaz_company' },
        {
          id: 'vedaz_company',
          username: 'Vedaz company',
          avatar_color: '#00A884',
          status: 'Official Group'
        },
        { upsert: true, returnDocument: 'after' }
      );

      return mongoose.connection;
    } catch (err) {
      console.error('[Database Error] Failed to connect to MongoDB Atlas:', err.message);
      console.log('[Database] Falling back to SQLite database...');
      isMongoMode = false;
    }
  }

  if (dbInstance) return dbInstance;

  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../chat.db');

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await dbInstance.run('PRAGMA foreign_keys = ON;');

  // Create Users Table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      password_hash TEXT,
      reset_otp TEXT,
      reset_expires DATETIME,
      avatar_color TEXT DEFAULT '#4F46E5',
      status TEXT DEFAULT 'offline',
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safely add missing columns for existing database files
  const columns = await dbInstance.all("PRAGMA table_info(users);");
  const colNames = columns.map(c => c.name);

  if (!colNames.includes('email')) {
    await dbInstance.exec("ALTER TABLE users ADD COLUMN email TEXT;");
  }
  if (!colNames.includes('phone')) {
    await dbInstance.exec("ALTER TABLE users ADD COLUMN phone TEXT;");
  }
  if (!colNames.includes('password_hash')) {
    await dbInstance.exec("ALTER TABLE users ADD COLUMN password_hash TEXT;");
  }
  if (!colNames.includes('reset_otp')) {
    await dbInstance.exec("ALTER TABLE users ADD COLUMN reset_otp TEXT;");
  }
  if (!colNames.includes('reset_expires')) {
    await dbInstance.exec("ALTER TABLE users ADD COLUMN reset_expires DATETIME;");
  }

  // Create Messages Table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      receiver_id TEXT DEFAULT NULL,
      text TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'sent',
      FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Ensure Vedaz company official group exists
  await dbInstance.exec(`
    INSERT OR IGNORE INTO users (id, username, avatar_color, status)
    VALUES ('vedaz_company', 'Vedaz company', '#00A884', 'Official Group');
  `);

  console.log(`[Database] SQLite database initialized at ${dbPath}`);
  return dbInstance;
}

module.exports = { getDatabase, isMongoConnected };
