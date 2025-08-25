export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: process.env.JWT_ISSUER || 'dev-web2025',
    audience: process.env.JWT_AUDIENCE || 'dev-web2025-users',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
  },
  rateLimit: {
    maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    windowMs: parseInt(process.env.LOGIN_WINDOW_MS || '300000'), // 5 minutos
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
};
