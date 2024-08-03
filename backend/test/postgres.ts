import postgres from 'postgres'

import { DATABASE_URL } from '../src/constants'

export const sql = postgres(DATABASE_URL, { prepare: false })
