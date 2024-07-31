import { BBatonTokenResponse, BBatonUserResponse } from '../src/api/auth/bbaton/post'

export const validBBatonTokenResponse: BBatonTokenResponse = {
  // user_name: gwak2837
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJnd2FrMjgzNyIsImlhdCI6MTUxNjIzOTAyMn0.CLK60_MlhfgrQPdO_h8hs_QvZOSrycsIDnu2BtAX3rU',
  token_type: 'bearer',
  expires_in: 123123123123,
  scope: 'public',
}

export const validBBatonUserResponse: BBatonUserResponse = {
  user_id: 'gwak2837',
  adult_flag: 'Y',
  birth_year: '20',
  gender: 'M',
  income: '',
  student: '',
}
