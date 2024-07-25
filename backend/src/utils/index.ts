export function toBigInt(value: string | null | undefined) {
  try {
    return value ? BigInt(value) : null
  } catch (_) {
    return null
  }
}

export function isNumberString(value: string) {
  return /^\d+$/.test(value)
}

type ReplaceNullWithUndefined<T> = {
  [K in keyof T]: T[K] extends null ? undefined : T[K]
}

export function removeNull<T extends object>(obj: T): ReplaceNullWithUndefined<T> {
  const result = {} as Record<keyof T, unknown>

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key] === null ? undefined : obj[key]
    }
  }

  return result as ReplaceNullWithUndefined<T>
}
