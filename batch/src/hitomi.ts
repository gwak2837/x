import * as cheerio from 'cheerio'
import { Browser, Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

const HITOMI_DOMAIN = 'https://hitomi.la'

export const driver = await new Builder()
  .forBrowser(Browser.CHROME)
  .setChromeOptions(new chrome.Options())
  .build()

export async function get작품Pathes() {
  await driver.get(`${HITOMI_DOMAIN}/index-korean.html`)

  const 작품PathesSelector = 'body > div.container > div.gallery-content > div > a'
  await driver.wait(until.elementLocated(By.css(작품PathesSelector)), 10000)

  const pageSource = await driver.getPageSource()

  const $ = cheerio.load(pageSource)
  return $(작품PathesSelector)
    .map((_, element) => $(element).attr('href'))
    .get()
}

export async function get작품ViewerPathes(작품Path: string) {
  await driver.get(`${HITOMI_DOMAIN}${작품Path}`)

  const 작품ViewerPathesSelector =
    'body > div > div.content > div.gallery-preview.lillie > div > ul > li > div > a'
  await driver.wait(until.elementLocated(By.css(작품ViewerPathesSelector)), 10000)

  const pageSource = await driver.getPageSource()

  const $ = cheerio.load(pageSource)
  return $(작품ViewerPathesSelector)
    .map((_, element) => $(element).attr('href'))
    .get()
}

export async function get작품ImageURL(작품ViewerPath: string) {
  await driver.get(`${HITOMI_DOMAIN}${작품ViewerPath}`)

  const 작품ImageSelector = '#comicImages > picture > source'
  await driver.wait(until.elementLocated(By.css(작품ImageSelector)), 10000)

  const pageSource = await driver.getPageSource()
  const $ = cheerio.load(pageSource)

  return $(작품ImageSelector).attr('srcset') ?? ''
}
