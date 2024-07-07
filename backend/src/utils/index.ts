export function toBigInt<T extends string | undefined>(
  value: T,
): T extends string ? bigint : undefined {
  return (value ? BigInt(value) : undefined) as T extends string ? bigint : undefined
}
