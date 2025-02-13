const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  accessToken: {
    expiresIn: '1h',
  },
  refreshToken: {
    expiresIn: '7d',
  },
};

export default jwtConfig;
