import fs from 'fs';
import path from 'path';

export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const log = `${timestamp} ${req.method} ${req.url}\n`;

  // logs 디렉토리가 없으면 생성
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  // 로그 파일에 기록
  fs.appendFile(path.join(logsDir, 'requests.log'), log, (err) => {
    if (err) console.error('로그 기록 실패:', err);
  });

  next();
};
