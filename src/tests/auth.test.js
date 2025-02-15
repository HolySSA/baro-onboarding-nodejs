import request from 'supertest';
import app from '../app.js';
import pool from '../config/database.config.js';

describe('Auth API Tests', () => {
  // 각 테스트 전에 테이블 초기화
  beforeEach(async () => {
    await pool.execute('DELETE FROM users');
  });

  describe('POST /signup', () => {
    const signupData = {
      username: 'JIN HO',
      password: '12341234',
      nickname: 'Mentos',
    };

    it('회원가입 성공', async () => {
      const response = await request(app).post('/signup').send(signupData).expect(201);

      expect(response.body.username).toBe(signupData.username);
      expect(response.body.nickname).toBe(signupData.nickname);
      expect(response.body.password).toBeUndefined();
      expect(response.body.authorities).toEqual([{ authorityName: 'ROLE_USER' }]);
    });

    it('이미 존재하는 사용자 400 에러', async () => {
      // 첫 번째 회원가입
      await request(app).post('/signup').send(signupData);

      // 같은 username으로 두 번째 회원가입 시도
      const response = await request(app).post('/signup').send(signupData).expect(400);

      expect(response.body.message).toBe('이미 존재하는 사용자입니다.');
    });
  });

  describe('POST /login', () => {
    const userData = {
      username: 'JIN HO',
      password: '12341234',
      nickname: 'Mentos',
    };

    beforeEach(async () => {
      // 각 로그인 테스트 전에 사용자 생성
      await request(app).post('/signup').send(userData);
    });

    it('로그인 성공', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: userData.username,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
    });

    it('올바르지 않은 비밀번호 401 에러', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: userData.username,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toBe('잘못된 인증 정보입니다.');
    });

    it('존재하지 않는 유저 401 에러', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'nonexistent',
          password: userData.password,
        })
        .expect(401);

      expect(response.body.message).toBe('잘못된 인증 정보입니다.');
    });
  });

  // 모든 테스트 완료 후 연결 종료
  afterAll(async () => {
    await pool.end();
    if (app.close) await app.close();
  });
});
