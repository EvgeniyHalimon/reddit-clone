import { Request, Response, Router } from 'express'
import { validateRequestSchema } from '../../shared/middleware/validationRequestSchema'
import authService from './auth.service'
import { loginSchema } from './validators/loginSchema'
import { registerSchema } from './validators/registerScheme'
import { ITokens } from './types'
import { CustomRequest } from '../../shared/types'

const register = async (req: Request, res: Response) => {
  try {
    const user = authService.register(req.body)
    // Return the user
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const token: ITokens = await authService.login(req.body)
    console.log("🚀 ~ file: auth.controller.ts:28 ~ login ~ token:", token)
  
    res.json({ refreshToken : token.refreshToken, accessToken: token.accessToken });
  } catch (err) {
    console.log(err)
    return res.json({ error: 'Something went wrong' })
  }
}

const router = Router()

router.get('/refresh', async (req: CustomRequest, res: Response) => {
  try {
    const token: ITokens = await authService.refreshToken(req.user.username);
    res.json({ refreshToken : token.refreshToken, accessToken: token.accessToken });
  } catch (error: any) {
    res.status(500).json({ 'message': error.message });
  }
});

router.post('/register', registerSchema, validateRequestSchema, register)
router.post('/login', loginSchema, validateRequestSchema, login)


export default router