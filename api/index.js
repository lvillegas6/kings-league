import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import leaderboard from '../db/leaderboard.json'
import presidents from '../db/presidents.json'
import teams from '../db/teams.json'

const app = new Hono()

app.get('/', (ctx) => {
  return ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the leaderboard'
    },
    {
      endpoint: '/presidents',
      description: 'Returns the presidents'
    },
    {
      endpoint: '/presidents/:id',
      description: 'Returns a president by id'
    },
    {
      endpoint: '/teams/:id',
      description: 'Returns the teams'
    }
  ])
})

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})

app.get('/presidents/:id', (ctx) => {
  const id = ctx.req.param('id')
  const president = presidents.find(president => president.id === id)
  return president
    ? ctx.json(president)
    : ctx.json({ message: 'President not found' }, 404)
})

app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

app.use('/static/*', serveStatic({ root: './' }))

export default app
