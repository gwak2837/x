import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET, DOMAIN_NAME } from '../constants'

export enum Type {
  ACCESS,
  REFRESH,
}

export async function signJWT(payload: JWTPayload, type: Type): Promise<string> {
  // NOTE(taeuk): https://developer.amazon.com/docs/login-with-amazon/access-token.html#:~:text=%22bearer%22%2C-,%22expires_in%22%3A3600%2C,-%22refresh_token%22%3A
  const exp = Math.floor(Date.now() / 1000) + 3600
  const secretKey = type === Type.ACCESS ? ACCESS_JWT_SECRET : REFRESH_JWT_SECRET

  return await new SignJWT({ ...payload, iss: DOMAIN_NAME })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(exp)
    .sign(new TextEncoder().encode(secretKey))
}

export async function verifyJWT(token: string, type: Type): Promise<JWTPayload> {
  const secretKey = type === Type.ACCESS ? ACCESS_JWT_SECRET : REFRESH_JWT_SECRET
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey), {
    algorithms: ['HS256'],
  })
  return payload
}
