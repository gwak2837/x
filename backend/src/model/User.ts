export enum UserSex {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

export enum UserFollowStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
}

export enum UserFollowStatusInput {
  ACCEPTED = 1,
  REJECTED = 2,
}

export enum UserSuspendedType {
  SELF = 0, // 스스로
  BLOCK = 1, // 차단
  SLEEP = 2, // 휴면 계정
  DELETE = 3, // 삭제 유예 기간
}

export enum UserSuspendedTypeInput {
  SELF = 0, // 스스로
  SLEEP = 2, // 휴면 계정
  DELETE = 3, // 삭제 유예 기간
}

export const USER_NAME_MAX_LENGTH = 255

export enum UserGrade {
  NORMAL = 0,
  VIP = 1,
  ADMIN = 2,
  SUPER_ADMIN = 3,
}

export type UserConfig = {
  termsOfServiceAgreedAt: string
  privacyPolicyAgreedAt: string
  marketingAgreedAt: string
}

export function encodeConfig(config?: UserConfig) {
  if (!config) {
    return undefined
  }
  return JSON.stringify({
    tosa: config.termsOfServiceAgreedAt,
    ppa: config.privacyPolicyAgreedAt,
    ma: config.marketingAgreedAt,
  })
}

export function decodeConfig(config: string): UserConfig {
  const obj = JSON.parse(config)
  return {
    termsOfServiceAgreedAt: obj.tosa,
    privacyPolicyAgreedAt: obj.ppa,
    marketingAgreedAt: obj.ma,
  }
}
