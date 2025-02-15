import request from 'supertest';
import app from '../app.js';
import pool from '../config/database.config.js';

describe('Middleware Tests', () => {
  beforeEach(async () => {
    // 테이블 초기화
    await pool.execute('DELETE FROM users');
  });

  describe('signup 검증 미들웨어', () => {
    it('필수 필드 누락 400 에러', async () => {
      const response = await request(app).post('/signup').send({
        username: 'testuser',
        // password 누락
        nickname: 'Test User',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('모든 필드를 입력해주세요.');
    });

    it('비밀번호 8자 미만 400 에러', async () => {
      const response = await request(app).post('/signup').send({
        username: 'testuser',
        password: '123', // 8자 미만
        nickname: 'Test User',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('비밀번호는 8자 이상이어야 합니다.');
    });
  });

  describe('login 제한 미들웨어', () => {
    it('5회 이상 로그인 시도 429 에러', async () => {
      // 먼저 테스트용 사용자 생성
      await request(app).post('/signup').send({
        username: 'testuser',
        password: '12345678',
        nickname: 'Test User',
      });

      // 5회 연속 잘못된 비밀번호로 로그인 시도
      for (let i = 0; i < 5; i++) {
        await request(app).post('/login').send({
          username: 'testuser',
          password: 'wrongpassword',
        });
      }

      // 6번째 시도
      const response = await request(app).post('/login').send({
        username: 'testuser',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(429);
      expect(response.body.message).toContain('너무 많은 로그인 시도');
    });
  });

  describe('404 에러 처리 미들웨어', () => {
    it('존재하지 않는 경로 요청 404 에러', async () => {
      const response = await request(app).get('/nonexistent-path');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('요청하신 경로를 찾을 수 없습니다.');
    });
  });

  describe('에러 처리 미들웨어', () => {
    it('서버 에러 발생 500 에러', async () => {
      // 의도적으로 에러를 발생시키는 테스트 라우트 필요
      // 테스트용 라우트를 추가하거나 모의 객체(mock) 사용
    });
  });

  // 모든 테스트 완료 후 서버 종료
  afterAll(async () => {
    await pool.end();
    if (app.close) await app.close();
  });
});
