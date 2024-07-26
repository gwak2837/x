/* eslint-disable @typescript-eslint/no-explicit-any */
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

type NullToUndefined<T> = T extends null ? undefined : T

type RecursivelyRemoveNull<T> = T extends Date
  ? T
  : T extends object
    ? { [K in keyof T]: RecursivelyRemoveNull<NullToUndefined<T[K]>> }
    : NullToUndefined<T>

export function recursivelyRemoveNull<T>(obj: T): RecursivelyRemoveNull<T> {
  if (obj === null) {
    return undefined as any
  }
  if (typeof obj !== 'object' || obj instanceof Date) {
    return obj as any
  }

  const result: any = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = recursivelyRemoveNull(obj[key])
    }
  }

  return result
}
