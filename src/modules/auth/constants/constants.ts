import { SetMetadata } from '@nestjs/common';
import { config } from 'dotenv';
config();

const DEFAULT_JWT_SECRET = 'dev-secret-key-change-me';

export const jwtConstants = {
  secret: process.env.SECRET_KEY ?? DEFAULT_JWT_SECRET,
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
