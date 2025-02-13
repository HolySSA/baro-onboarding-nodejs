import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, users } from '../models/user.js';
import jwtConfig from '../config/jwt.config.js';

/**
 * 회원가입
 * POST /signup
 */
const signup = async (req, res) => {
  try {
    const { username, password, nickname } = req.body;

    if (users.has(username)) {
      return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(username, hashedPassword, nickname);
    users.set(username, newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
  }
};

/**
 * 로그인
 * POST /login
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.get(username);
    if (!user) {
      return res.status(401).json({ message: '잘못된 인증 정보입니다.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '잘못된 인증 정보입니다.' });
    }

    const token = jwt.sign({ username: user.username }, jwtConfig.secret, {
      expiresIn: jwtConfig.accessToken.expiresIn,
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
};

export { signup, login };
