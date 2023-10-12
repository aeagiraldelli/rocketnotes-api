import path from 'path';
import { fileURLToPath } from 'url';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function databaseConnection() {
  const database = await open({
    filename: path.resolve(__dirname, '../', 'database.db'),
    driver: sqlite3.Database,
  });

  return database;
}
