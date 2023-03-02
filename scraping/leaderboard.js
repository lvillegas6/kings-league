import * as cheerio from 'cheerio'
import { writeDBFile, TEAMS, PRESIDENTS } from '../db/index.js'

const URLS = {
  leaderboard: 'https://kingsleague.pro/clasificacion/'
}

async function scrape(url) {
  const rest = await fetch(url)
  const html = await rest.text()
  return cheerio.load(html)
}

async function getLeaderBoard() {
  const $ = await scrape(URLS.leaderboard)
  const $rows = $('table tbody tr')

  const cleanText = (text) => text.replace(/\t|\n|\s:/g, '')

  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
    concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
    CardsYellow: { selector: '.fs-table-text_8', typeOf: 'number' },
    cardsRed: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  const getTeamFrom = ({ name }) => {
    const { presidentId, ...restOfTeam } = TEAMS.find(
      (team) => team.name === name
    )
    const president = PRESIDENTS.find(
      (president) => president.id === presidentId
    )
    return {
      ...restOfTeam,
      president
    }
  }
  const leaderboard = []
  $rows.each((_, el) => {
    const leaderBoardEntries = Object.entries(LEADERBOARD_SELECTORS).map(
      ([key, { selector, typeOf }]) => {
        const rawValue = $(el).find(selector).text()
        const cleanedValue = cleanText(rawValue)
        const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue

        return [key, value]
      }
    )
    const { team: teamName, ...leaderBoardForTeam } =
      Object.fromEntries(leaderBoardEntries)
    const team = getTeamFrom({ name: teamName })
    leaderboard.push({
      ...leaderBoardForTeam,
      team
    })
  })

  return leaderboard
}

const leaderboard = await getLeaderBoard()
await writeDBFile('leaderboard.json', leaderboard)
