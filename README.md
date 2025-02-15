# 백엔드 개발 온보딩 과제 (Node.js)

- Jest를 이용한 테스트 코드 작성법 이해
- Express.js와 Middleware에 대한 이해
- JWT와 구체적인 알고리즘의 이해
- 리뷰 바탕으로 개선하기
- EC2에 배포해보기

## Express.js와 Middleware 기본 이해

[Express.js와 Middleware](docs/express-middleware.md)

## JWT 기본 이해

[JWT 기본 이해](docs/jwt-basic.md)

## 토큰 발행과 유효성 확인

[토큰 발행과 유효성 확인](docs/token-validation.md)

### 테스트 환경 구성

```bash
yarn test jwt.test.js # JWT 테스트 실행
yarn test -t "그룹명" # 특정 테스트 그룹 실행
yarn test -t "테스트명" # 특정 테스트 케이스 실행
```

## 유닛 테스트 작성

[유닛 테스트 작성](docs/unit-test.md)

## 개선 사항

### Refresh Token / Access Token 개선

```mermaid
sequenceDiagram
  Client->>Server: 1. 로그인 요청
  Server->>Client: 2. Access Token + Refresh Token 발급
  (Client: Access Token & Refresh Token 저장)
  Client->>Server: 3. API 요청 with Access Token
  Server->>Client: 4. 응답
  ...
  (Client: Access Token 만료)
  Client->>Server: 5. 새로운 Access Token 요청 with Refresh Token
  Server->>Client: 6. 새로운 Access Token 발급
  (Client: Access Token 갱신)
  ...
```

### 구현 시나리오

#### 로그인 시 Refresh & Access Token 발급

```javascript
// login 요청 시
// ...

// Access Token 발급 (짧은 유효기간)
const accessToken = jwt.sign(
  { username: user.username },
  jwtConfig.secret,
  { expiresIn: '1h' }, // 1시간
);

// Refresh Token 발급 (긴 유효기간)
const refreshToken = jwt.sign(
  { username: user.username },
  jwtConfig.secret,
  { expiresIn: '7d' }, // 7일
);

res.json({
  accessToken,
  refreshToken,
});
```

#### Refresh Token 사용 시나리오

```javascript
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // ...

    // Refresh Token 검증
    const decoded = jwt.verify(refreshToken, jwtConfig.secret);

    // 새로운 Access Token 발급
    const newAccessToken = jwt.sign({ username: decoded.username }, jwtConfig.secret, {
      expiresIn: '1h',
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: '토큰이 만료되었습니다.' });
  }
};
```

#### 개선 효과

- 자주 로그인하지 않아도 됨.
- Access Token 탈취 위험 감소.
- 보안과 사용자 편의성 균형.
- 서버 부하 감소 (매 요청마다 DB 조회 불필요).
