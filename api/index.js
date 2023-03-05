import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import leaderboard from '../db/leaderboard.json'
import mvp from '../db/mvp.json'
import presidents from '../db/presidents.json'
import teams from '../db/teams.json'
import topAssists from '../db/top-assists.json'
import topScorers from '../db/top-scorers.json'

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
    }
  ])
)

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
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

app.get('/static/*', serveStatic({ root: './' }))

app.notFound((c) => {
  const { pathname } = new URL(c.req.url)

  if (c.req.url.at(-1) === '/') {
    return c.redirect(pathname.slice(0, -1))
  }

  return c.json({ message: 'Not Found' }, 404)
})

export default app
