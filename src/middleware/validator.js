export const validateSignupRequest = (req, res, next) => {
  const { username, password, nickname } = req.body;

  // 필수 필드 검증
  if (!username || !password || !nickname) {
    return res.status(400).json({
      message: '모든 필드를 입력해주세요.',
    });
  }

  // 비밀번호 길이 검증
  if (password.length < 8) {
    return res.status(400).json({
      message: '비밀번호는 8자 이상이어야 합니다.',
    });
  }

  // username 형식 검증 (영문, 숫자만 허용)
  if (!/^[A-Za-z0-9]+$/.test(username)) {
    return res.status(400).json({
      message: '아이디는 영문자와 숫자만 사용 가능합니다.',
    });
  }

  next();
};
