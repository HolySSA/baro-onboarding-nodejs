import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.js';
import { requestLogger } from './middleware/logger.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.config.js';

dotenv.config();

const app = express();

// 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로깅 미들웨어
app.use(requestLogger);

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 라우터 등록
app.use('/', authRoutes);

// 404 처리 미들웨어
app.use((req, res) => {
  res.status(404).json({ message: '요청하신 경로를 찾을 수 없습니다.' });
});

// 에러 처리 미들웨어
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// 테스트 환경이 아닐 때만 서버 시작
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.close = (callback) => {
    server.close(callback);
  };
}

export default app;
