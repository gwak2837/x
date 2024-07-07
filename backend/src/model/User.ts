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
  SELF = 0,
  BLOCK = 1,
  SLEEP = 2, // 휴면 계정
  DELETE = 3, // 삭제 유예 기간
}

export const USER_NAME_MAX_LENGTH = 255

// export async function createOAuthUser({
//   ageRange = 20,
//   sex = 1,
//   oAuthId = 'gwak2837',
//   provider = OAuthProvider.BBATON,
// }) {
//   return await prisma.user.create({
//     data: {
//       ageRange,
//       sex,
//       oAuth: {
//         create: {
//           id: oAuthId,
//           provider,
//         },
//       },
//     },
//   })
// }

// export async function getOAuthUser({ oAuthId = 'gwak2837', provider = OAuthProvider.BBATON }) {
//   const oAuth = await prisma.oAuth.findUnique({ where: { id_provider: { id: oAuthId, provider } } })
//   if (!oAuth?.userId) return null

//   return await prisma.user.findUnique({ where: { id: oAuth.userId } })
// }

// export async function deleteOAuthUser({ oAuthId = 'gwak2837', provider = OAuthProvider.BBATON }) {
//   const deleteOAuth = await prisma.oAuth.delete({
//     where: {
//       id_provider: {
//         id: oAuthId,
//         provider,
//       },
//     },
//   })
//   if (!deleteOAuth.userId) return

//   await prisma.user.delete({
//     where: {
//       id: deleteOAuth.userId,
//     },
//   })
// }
