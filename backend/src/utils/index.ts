export function toBigInt(value: string | null | undefined) {
  try {
    return value ? BigInt(value) : null
  } catch (_) {
    return null
  }
}
