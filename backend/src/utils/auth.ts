import { UserSuspendedType } from '../model/User'

export const LoginNotAllowed = [
  UserSuspendedType.BLOCK,
  UserSuspendedType.SLEEP,
  UserSuspendedType.DELETE,
]
