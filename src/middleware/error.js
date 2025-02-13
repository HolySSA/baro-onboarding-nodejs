export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: '입력값이 올바르지 않습니다.',
      details: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: '인증에 실패했습니다.',
    });
  }

  res.status(500).json({
    message: '서버 오류가 발생했습니다.',
  });
};
