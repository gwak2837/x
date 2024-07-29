export enum OAuthProvider {
  BBATON = 0,
  NAVER = 1,
  KAKAO = 2,
  GOOGLE = 3,
  FACEBOOK = 4,
}

export enum UserSex {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

export enum UserSuspendedType {
  SELF = 0, // 스스로
  BLOCK = 1, // 차단
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
