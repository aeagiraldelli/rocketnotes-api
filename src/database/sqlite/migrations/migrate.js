import { databaseConnection } from '../database.js';
import { createUsers } from './createUsers.js';

export async function migrate() {
  const schemas = [createUsers].join('');
  databaseConnection()
    .then((db) => db.exec(schemas))
    .catch((error) => console.error(error));
}
