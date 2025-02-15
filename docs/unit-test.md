# Jest를 이용한 단위 테스트

## 1. 인증 API 테스트 (auth.test.js)

### 회원가입 테스트

- 회원가입 성공 검증

  - 201 상태 코드
  - 응답 데이터 검증 (username, nickname)
  - 비밀번호 제외 확인
  - 기본 권한(ROLE_USER) 확인

- 중복 회원가입 검증
  - 400 상태 코드
  - 에러 메시지 확인

### 로그인 테스트

- 로그인 성공 검증

  - 200 상태 코드
  - JWT 토큰 발급 확인

- 실패 케이스 검증
  - 잘못된 비밀번호 (401)
  - 존재하지 않는 사용자 (401)

## 2. JWT 토큰 테스트 (jwt.test.js)

### Access Token 테스트

- 토큰 발급 및 검증
  - 페이로드 데이터 확인
  - 만료 시간 검증

### Refresh Token 테스트

- 토큰 발급 및 갱신
  - Refresh Token 발급
  - Access Token 갱신

### 토큰 유효성 검증

- 서명 검증
- 형식 검증
- 구조 검증

## 3. 미들웨어 테스트 (middleware.test.js)

### 회원가입 검증 미들웨어

- 필수 필드 검증 (400)
- 비밀번호 길이 검증 (400)

### 로그인 제한 미들웨어

- 과도한 로그인 시도 제한 (429)

### 에러 처리 미들웨어

- 404 에러 처리
- 서버 에러 처리 (500)

## 테스트 실행 방법

```bash
# 전체 테스트 실행
yarn test

# 특정 파일만 테스트
yarn test auth.test.js
yarn test jwt.test.js
yarn test middleware.test.js

# 특정 테스트 그룹만 실행
yarn test -t "회원가입 테스트"

# 테스트 커버리지 확인
yarn test:coverage
```

## 테스트 구조

```javascript
describe('테스트 그룹', () => {
  // 각 테스트 전에 실행
  beforeEach(() => {
    // 초기화 작업
  });

  it('개별 테스트 케이스', async () => {
    // 테스트 로직
    const response = await request(app).post('/endpoint').send(data);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('key');
  });

  // 모든 테스트 완료 후 실행
  afterAll((done) => {
    // 정리 작업
  });
});
```

## 사용된 테스트 도구

- Jest: JavaScript 테스트 프레임워크
- Supertest: HTTP 테스트 라이브러리
- expect(): Jest의 assertion 라이브러리
