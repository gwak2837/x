export function extractHashtags(content?: string) {
  return content?.match(/#[\p{L}\p{N}\p{M}_]+/gu)?.map((tag) => ({ name: tag.slice(1) }))
}
