# 토큰 발행과 유효성 확인

## 테스트 시나리오 구성

### 1. Access Token 테스트

#### 1.1 토큰 발행 테스트

- 유효한 Access Token 발급 검증
  - 토큰 생성 (1시간 유효).
  - 페이로드(username, role) 검증.

```javascript
it('유효한 Access Token 발급', () => {
  const accessToken = jwt.sign(testUser, jwtConfig.secret, {
    expiresIn: '1h',
  });
  const decoded = jwt.verify(accessToken, jwtConfig.secret);
  expect(decoded.username).toBe(testUser.username);
  expect(decoded.role).toBe(testUser.role);
});
```

#### 1.2 토큰 만료 테스트

- Access Token 만료 검증
  - 1초 후 만료되는 토큰 생성
  - 2초 대기 후 만료 확인

```javascript
it('Access Token 만료', async () => {
  const accessToken = jwt.sign(testUser, jwtConfig.secret, {
    expiresIn: '1s',
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  expect(() => {
    jwt.verify(accessToken, jwtConfig.secret);
  }).toThrow(jwt.TokenExpiredError);
});
```

### 2. Refresh Token 테스트

#### 2.1 Refresh Token 발행

- 유효한 Refresh Token 발급 검증
  - 토큰 생성 (7일 유효)
  - 페이로드(username) 검증

```javascript
it('유효한 Refresh Token 발급', () => {
  const refreshToken = jwt.sign(testUser, jwtConfig.secret, {
    expiresIn: '7d',
  });
  const decoded = jwt.verify(refreshToken, jwtConfig.secret);
  expect(decoded.username).toBe(testUser.username);
});
```

#### 2.2 토큰 갱신 테스트

- Refresh Token으로 새로운 Access Token 발급
  - Refresh Token 검증
  - 새로운 Access Token 발급
  - 새로 발급된 토큰 검증

```javascript
it('Refresh Token으로 새로운 Access Token 발급', () => {
  const refreshToken = jwt.sign(testUser, jwtConfig.secret, {
    expiresIn: '7d',
  });
  const decoded = jwt.verify(refreshToken, jwtConfig.secret);
  const newAccessToken = jwt.sign(
    { username: decoded.username, role: decoded.role },
    jwtConfig.secret,
    { expiresIn: '1h' },
  );
  const decodedNewToken = jwt.verify(newAccessToken, jwtConfig.secret);
  expect(decodedNewToken.username).toBe(testUser.username);
});
```

### 3. 토큰 유효성 검증 테스트

#### 3.1 서명 검증

- 잘못된 시크릿 키로 검증 시 실패

```javascript
it('유효하지 않은 키로 검증', () => {
  const token = jwt.sign(testUser, jwtConfig.secret);
  expect(() => {
    jwt.verify(token, 'wrong-secret');
  }).toThrow(jwt.JsonWebTokenError);
});
```

#### 3.2 토큰 형식 검증

- 잘못된 형식의 토큰 검증
- JWT 구조(header.payload.signature) 확인

```javascript
it('잘못된 형식의 토큰 검증', () => {
  expect(() => {
    jwt.verify('malformed-token', jwtConfig.secret);
  }).toThrow(jwt.JsonWebTokenError);
});
it('토큰 구조 검증', () => {
  const token = jwt.sign(testUser, jwtConfig.secret);
  const parts = token.split('.');
  expect(parts).toHaveLength(3);
});
```
