import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { validateSignupRequest } from '../middleware/validator.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - nickname
 *             properties:
 *               username:
 *                 type: string
 *                 description: 사용자 아이디
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *               nickname:
 *                 type: string
 *                 description: 닉네임
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       400:
 *         description: 이미 존재하는 사용자
 *       500:
 *         description: 서버 에러
 */
router.post('/signup', validateSignupRequest, signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 사용자 아이디
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT Access Token
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 에러
 */
router.post('/login', loginLimiter, login);

export default router;
