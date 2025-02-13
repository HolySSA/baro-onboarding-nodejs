import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // IP당 최대 5회 시도
  message: {
    message: '너무 많은 로그인 시도가 있었습니다. 15분 후에 다시 시도해주세요.',
  },
});
