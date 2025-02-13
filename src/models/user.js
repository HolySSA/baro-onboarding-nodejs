class User {
  constructor(username, password, nickname) {
    this.username = username;
    this.password = password;
    this.nickname = nickname;
    this.authorities = [{ authorityName: 'ROLE_USER' }];
  }
}

// 임시 데이터 저장소 (데이터베이스로 수정해야함)
const users = new Map();

export { User, users };
