export type Nullable<T> = {
  [P in keyof T]: T[P] | null
}

export function removeZero(value: string) {
  return value === '0' ? undefined : value
}
