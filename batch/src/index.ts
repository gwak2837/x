import { driver, get작품ImageURL, get작품Pathes, get작품ViewerPathes } from './hitomi'

try {
  const 작품Pathes = await get작품Pathes()
  console.log('👀 - 작품Pathes:', 작품Pathes)
  const 작품ViewerPathes = await get작품ViewerPathes(작품Pathes[0])
  console.log('👀 - 작품ViewerPathes:', 작품ViewerPathes)
  const 작품이미지URL = await get작품ImageURL(작품ViewerPathes[0])
  console.log('👀 - 작품이미지URL:', 작품이미지URL)
} finally {
  await driver.quit()
}
