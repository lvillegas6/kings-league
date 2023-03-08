import { logError, logInfo, logSuccess } from './log.js'
import { writeDBFile } from '../db/index.js'
import { getLeaderBoard } from './leaderboard.js'
import { getMvpList } from './mvp.js'
import { scrape } from './utils.js'
import { getTopScoresList } from './top-scorers.js'
import { getAssists } from './top-assists.js'
import { getPlayersTwelve } from './players-twelve.js'

export const SCRAPINGS = {
  leaderboard: {
    url: 'https://kingsleague.pro/estadisticas/clasificacion/',
    scraper: getLeaderBoard
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMvpList
  },
  'top-scorers': {
    url: 'https://kingsleague.pro/estadisticas/goles/',
    scraper: getTopScoresList
  },
  'top-assists': {
    url: 'https://kingsleague.pro/estadisticas/asistencias/',
    scraper: getAssists
  },
  'players-twelve': {
    url: 'https://kingsleague.pro/jugador-12/',
    scraper: getPlayersTwelve
  }
}

export async function scrapeAndSave(name) {
  const start = performance.now()
  const { url, scraper } = SCRAPINGS[name]
  try {
    logInfo(`Getting ${name} list...`)
    const $ = await scrape(url)
    const content = await scraper($)
    await writeDBFile(name, content)
    logSuccess(`${name} list saved!`)
  } catch (error) {
    logError(`Couldn't get ${name}`)
    logError(error)
  } finally {
    const end = performance.now()
    const time = (end - start) / 1000
    logInfo(`Time to get ${name}: ${time} seconds`)
  }
}

for (const name in SCRAPINGS) {
  await scrapeAndSave(name)
}
