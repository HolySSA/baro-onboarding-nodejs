import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config.js';

describe('JWT Token Tests', () => {
  // 테스트용 사용자 데이터
  const testUser = {
    username: 'testuser',
    role: 'ROLE_USER',
  };

  describe('Access Token Tests', () => {
    it('유효한 Access Token 발급', () => {
      const accessToken = jwt.sign(testUser, jwtConfig.secret, {
        expiresIn: '1h',
      });

      const decoded = jwt.verify(accessToken, jwtConfig.secret);
      expect(decoded.username).toBe(testUser.username);
      expect(decoded.role).toBe(testUser.role);
    });

    it('Access Token 만료', async () => {
      // 1초 후 만료되는 토큰 생성
      const accessToken = jwt.sign(testUser, jwtConfig.secret, {
        expiresIn: '1s',
      });

      // 2초 대기
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 만료된 토큰 검증 시도
      expect(() => {
        jwt.verify(accessToken, jwtConfig.secret);
      }).toThrow(jwt.TokenExpiredError);
    });
  });

  describe('Refresh Token Tests', () => {
    it('유효한 Refresh Token 발급', () => {
      const refreshToken = jwt.sign(testUser, jwtConfig.secret, {
        expiresIn: '7d',
      });

      const decoded = jwt.verify(refreshToken, jwtConfig.secret);
      expect(decoded.username).toBe(testUser.username);
    });

    it('Refresh Token으로 새로운 Access Token 발급', () => {
      // Refresh 토큰 생성
      const refreshToken = jwt.sign(testUser, jwtConfig.secret, {
        expiresIn: '7d',
      });

      // Refresh 토큰 검증
      const decoded = jwt.verify(refreshToken, jwtConfig.secret);

      // 새로운 Access 토큰 발급
      const newAccessToken = jwt.sign(
        { username: decoded.username, role: decoded.role },
        jwtConfig.secret,
        { expiresIn: '1h' },
      );

      // 새로 발급된 Access 토큰 검증
      const decodedNewToken = jwt.verify(newAccessToken, jwtConfig.secret);
      expect(decodedNewToken.username).toBe(testUser.username);
    });
  });

  describe('Token Validation Tests', () => {
    it('유효하지 않은 키로 검증', () => {
      const token = jwt.sign(testUser, jwtConfig.secret);

      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow(jwt.JsonWebTokenError);
    });

    it('잘못된 형식의 토큰 검증', () => {
      expect(() => {
        jwt.verify('malformed-token', jwtConfig.secret);
      }).toThrow(jwt.JsonWebTokenError);
    });

    it('토큰 구조 검증', () => {
      const token = jwt.sign(testUser, jwtConfig.secret);
      const parts = token.split('.');

      // JWT는 header.payload.signature 형식
      expect(parts).toHaveLength(3);
    });
  });
});
