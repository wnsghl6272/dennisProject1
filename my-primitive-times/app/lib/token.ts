// lib/token.ts
import jwt from 'jsonwebtoken';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '5m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
