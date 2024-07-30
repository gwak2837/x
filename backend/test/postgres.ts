import postgres from 'postgres'

import { DATABASE_URL } from '../src/constants'

export const sql = postgres(DATABASE_URL, { prepare: false })

export enum PostgresErrorCode {
  UNIQUE_VIOLATION = '23505',
}

export const POSTGRES_MAX_BIGINT = '9223372036854775807'
