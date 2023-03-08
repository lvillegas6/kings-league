import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import leaderboard from '../db/leaderboard.json'
import mvp from '../db/mvp.json'
import presidents from '../db/presidents.json'
import teams from '../db/teams.json'
import topAssists from '../db/top-assists.json'
import topScorers from '../db/top-scorers.json'
import playersTwelve from '../db/players-twelve.json'
import schedule from '../db/schedule.json'

const app = new Hono()

app.get('/', (ctx) =>
  ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns Kings League leaderboard'
    },
    {
      endpoint: '/teams',
      description: 'Returns Kings League teams'
    },
    {
      endpoint: '/presidents',
      description: 'Returns Kings League presidents'
    },
    {
      endpoint: '/mvp',
      description: 'Returns Kings League MVP'
    },
    {
      endpoint: '/top-assists',
      description: 'Returns Kings League top assists'
    },
    {
      endpoint: '/top-scorers',
      description: 'Returns Kings League top scorers'
    },
    {
      endpoint: '/players-12',
      description: 'Returns all Kings League Players Twelve'
    }
  ])
)

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

app.get('/leaderboard/:teamId', (ctx) => {
  const teamId = ctx.req.param('teamId')
  const foundTeam = leaderboard.find((stats) => stats.team.id === teamId)

  return foundTeam ? ctx.json(foundTeam) : ctx.json({ message: 'Team not found' }, 404)
})

app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})

app.get('/presidents/:id', (ctx) => {
  const id = ctx.req.param('id')
  const foundPresident = presidents.find((president) => president.id === id)

  return foundPresident
    ? ctx.json(foundPresident)
    : ctx.json({ message: 'President not found' }, 404)
})

app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

app.get('/teams/:id', (ctx) => {
  const id = ctx.req.param('id')
  const foundTeam = teams.find((team) => team.id === id)

  return foundTeam
    ? ctx.json(foundTeam)
    : ctx.json({ message: 'Team not found' }, 404)
})

app.get('/mvp', (ctx) => {
  return ctx.json(mvp)
})

app.get('/top-scorer', (ctx) => {
  return ctx.json(topAssists)
})

app.get('/assists', (ctx) => {
  return ctx.json(topScorers)
})

app.get('/schedule', (ctx) => {
  return ctx.json(schedule)
})

app.get('/teams/:id/players-12', (ctx) => {
  const id = ctx.req.param('id')
  const foundPlayerTwelve = playersTwelve.filter((player) => player.team.id === id)

  return foundPlayerTwelve
    ? ctx.json(foundPlayerTwelve)
    : ctx.json({ message: `Players for team ${id} not found` }, 404)
})

app.get('/players-12', (ctx) => ctx.json(playersTwelve))

app.get('/static/*', serveStatic({ root: './' }))

app.notFound((c) => {
  const { pathname } = new URL(c.req.url)

  if (c.req.url.at(-1) === '/') {
    return c.redirect(pathname.slice(0, -1))
  }

  return c.json({ message: 'Not Found' }, 404)
})

export default app
