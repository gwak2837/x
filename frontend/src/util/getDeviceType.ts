'use server'

import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

/**
 * CSS `@media` 쿼리를 우선으로 활용하고, 해당 로직을 사용하기 까다로운 경우에만 사용하기
 *
 * 예: PC/태블릿/모바일 환경에 따라 텍스트를 구분해서 보여주는 경우
 */
export default async function getDeviceType() {
  const { get } = await headers()
  const userAgentString = get('user-agent')
  const userAgentInstance = new UAParser(userAgentString || '')
  const device = userAgentInstance.getDevice()

  return device.type
}
