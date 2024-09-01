import * as cheerio from 'cheerio'
import { Browser, Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

const HITOMI_DOMAIN = 'https://hitomi.la'

export const driver = await new Builder()
  .forBrowser(Browser.CHROME)
  .setChromeOptions(new chrome.Options())
  .build()

type Params = {
  page?: number
}

export async function get작품Infos({ page = 1 }: Params = {}) {
  await driver.get(`${HITOMI_DOMAIN}/index-korean.html${page > 1 ? `?page=${page}` : ''}`)

  const 작품TitleSelector = 'body > div > div.gallery-content > div'
  await driver.wait(until.elementLocated(By.css(작품TitleSelector)), 10000)

  const pageSource = await driver.getPageSource()

  const $ = cheerio.load(pageSource)
  const mangas = $('body > div > div.gallery-content > div')

  return mangas
    .map((_, manga) => ({
      hitomiId:
        $(manga)
          .find('div > a')
          .attr('href')
          ?.match(/(\d+)\.html$/)?.[1] ?? '',
      title: $(manga).find('div > h1 > a').text(),
      artists: $(manga)
        .find('div > div.artist-list > ul > li > a')
        .map((_, artist) => $(artist).text())
        .get(),
      series: $(manga)
        .find(
          'div > div.dj-content > table > tbody > tr:nth-child(1) > td.series-list > ul > li > a',
        )
        .map((_, series) => $(series).text())
        .get(),
      type: $(manga)
        .find('div > div.dj-content > table > tbody > tr:nth-child(2) > td:nth-child(2) > a')
        .text(),
      group: [],
      characters: [],
      tags: $(manga)
        .find(
          'div > div.dj-content > table > tbody > tr:nth-child(4) > td.relatedtags > ul > li > a',
        )
        .map((_, series) => $(series).text())
        .get()
        .filter((tag) => tag !== '...'),
      createdAt: $(manga).find('div > div.dj-content > p').attr('data-posted') ?? '',
    }))
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
