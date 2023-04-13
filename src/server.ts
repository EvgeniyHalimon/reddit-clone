import { createConnection } from 'typeorm'
import express, { Request, Response, NextFunction} from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bodyParser from 'body-parser'

import authRoutes from './modules/auth/auth.controller'
import postRoutes from './modules/posts/posts.controller'
import subRoutes from './modules/subs/subs.controller'
import miscRoutes from './modules/misc/misc.controller'
import userRoutes from './modules/users/users.controller'
import trim from './shared/middleware/trim'
import { ValidationError } from 'express-validation'
import verifyJWT from './shared/middleware/verifyJWT'

const app = express()
dotenv.config()
const PORT = process.env.PORT

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.use(verifyJWT);
app.get('/', (_, res) => res.send('Hello World'))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/subs', subRoutes)
app.use('/api/misc', miscRoutes)
app.use('/api/users', userRoutes)

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`)

  try {
    await createConnection()
    console.log('Database connected!')
  } catch (err) {
    console.log(err)
  }
})

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});