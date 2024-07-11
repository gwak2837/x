export function toBigInt(value: string | undefined | null) {
  try {
    return value ? BigInt(value) : null
  } catch (_) {
    return null
  }
}
