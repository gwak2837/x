import type { JWTPayload} from 'jose';

import { SignJWT, jwtVerify } from 'jose'

import { ACCESS_JWT_SECRET, DOMAIN_NAME, REFRESH_JWT_SECRET } from '../constants'

export enum TokenType {
  ACCESS,
  REFRESH,
}

export async function signJWT(
  payload: JWTPayload,
  type: TokenType,
  expires?: number,
): Promise<string> {
  // NOTE: https://developer.amazon.com/docs/login-with-amazon/access-token.html
  const duration = type === TokenType.ACCESS ? 3600 : 3600 * 720
  const secretKey = type === TokenType.ACCESS ? ACCESS_JWT_SECRET : REFRESH_JWT_SECRET

  return await new SignJWT({ ...payload, iss: DOMAIN_NAME })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expires ?? Math.floor(Date.now() / 1000) + duration)
    .sign(new TextEncoder().encode(secretKey))
}

export async function verifyJWT(token: string, type: TokenType): Promise<JWTPayload> {
  const secretKey = type === TokenType.ACCESS ? ACCESS_JWT_SECRET : REFRESH_JWT_SECRET
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey), {
    algorithms: ['HS256'],
  })
  return payload
}
