import { databaseConnection } from '../database/sqlite/database.js';

export class UserRepository {
  /**
   * @param {string} email
   * @returns {Promise<Object>} user
   */
  async findByEmail(email) {
    const db = await databaseConnection();
    const user = await db.get('SELECT * FROM users WHERE email = (?)', [email]);

    return user;
  }

  /**
   * @param {number} id
   * @returns {Promise<Object>} user
   */
  async findById(id) {
    const db = await databaseConnection();
    const user = await db.get('SELECT * FROM users WHERE id = (?)', [id]);

    return user;
  }

  /**
   * @description Create a new user in database.
   * @param {String} name
   * @param {String} email
   * @param {String} password
   * @returns {Promise<number>}
   */
  async create({ name, email, password }) {
    const cmd = `INSERT INTO users 
                 (name, email, password)
                 VALUES
                 (?, ?, ?)`;
    const db = await databaseConnection();
    const id = await db.run(cmd, [name, email, password]);

    return { id };
  }

  /**
   * @description update user info by id.
   * @param {number} id
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @return {Promise<void>}
   */
  async update({ id, name, email, password }) {
    const cmd = `
        UPDATE users 
        SET
          name = ?,
          email = ?,
          password = ?,
          updated_at = DATETIME('now')
        WHERE id = ?`;

    const db = await databaseConnection();
    await db.run(cmd, [name, email, password, id]);
  }
}
