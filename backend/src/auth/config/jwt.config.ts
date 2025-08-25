import { JwtModuleOptions } from '@nestjs/jwt';
import { authConfig } from './auth.config';

export const jwtConfig: JwtModuleOptions = {
  secret: authConfig.jwt.secret,
  signOptions: {
    expiresIn: authConfig.jwt.expiresIn,
    issuer: authConfig.jwt.issuer,
    audience: authConfig.jwt.audience,
  },
  verifyOptions: {
    issuer: authConfig.jwt.issuer,
    audience: authConfig.jwt.audience,
  },
};
