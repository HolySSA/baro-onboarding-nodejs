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
  Client->>Server: 5. 새 Access Token 요청 with Refresh Token
  Server->>Client: 6. 새 Access Token 발급
  (Client: Access Token 저장)
  ...
```
