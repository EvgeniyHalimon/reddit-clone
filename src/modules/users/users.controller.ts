import { Request, Response, Router } from 'express'

import user from '../../shared/middleware/user'
import usersService from './users.service'

const getUserSubmissions = async (req: Request, res: Response) => {
  console.log("🚀 ~ file: users.controller.ts:9 ~ getUserSubmissions ~ req.params.username:", req.params.username)
  try {
    const submissions = await usersService.getSubmissions(req.params.username, res.locals.user)
    console.log("🚀 ~ file: users.controller.ts:10 ~ getUserSubmissions ~ submissions:", submissions)

    return res.json(submissions)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const router = Router()

router.get('/:username', user, getUserSubmissions)

export default router