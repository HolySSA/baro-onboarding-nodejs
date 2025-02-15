import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JWT Authentication API',
      version: '1.0.0',
      description: '회원가입/로그인 API 문서',
    },
    servers: [
      {
        url: 'https://holyshin.shop:3000',
        description: '프로덕션 서버',
      },
      {
        url: 'http://localhost:3000',
        description: '개발 서버',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // API 라우트 파일 경로
};

export const specs = swaggerJsdoc(options);
