import { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

import auth from '../../shared/middleware/auth'
import user from '../../shared/middleware/user'
import authService from './auth.service'
import { validate } from 'express-validation'
import { loginSchema } from './validators/loginSchema'
import { registerSchema } from './validators/registerScheme'

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body

  try {
    const user = authService.register(email, username, password)
    // Return the user
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  console.log("🚀 ~ file: auth.controller.ts:27 ~ login ~ req.body:", req.body)

  try {
    const user = authService.login(username, password)
    if(user){
      const token = jwt.sign({ username }, process.env.JWT_SECRET!)
      res.set(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3600,
          path: '/',
        })
      )
    }
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.json({ error: 'Something went wrong' })
  }
}

const me = (_: Request, res: Response) => {
  return res.json(res.locals.user)
}

const logout = (_: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    })
  )

  return res.status(200).json({ success: true })
}

const router = Router()
router.post('/register', validate(registerSchema, {}, {}), register)
router.post('/login', validate(loginSchema, {}, {}), login)
router.get('/me', user, auth, me)
router.get('/logout', user, auth, logout)

export default router