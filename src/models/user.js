import pool from '../config/database.config.js';

class User {
  constructor(username, password, nickname) {
    this.username = username;
    this.password = password;
    this.nickname = nickname;
    this.authorities = [{ authorityName: 'ROLE_USER' }];
  }

  static async create(user) {
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)',
      [user.username, user.password, user.nickname],
    );
    return result;
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }
}

export { User };
