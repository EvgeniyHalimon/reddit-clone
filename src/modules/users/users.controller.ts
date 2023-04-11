import { Request, Response, Router } from 'express'

import user from '../../shared/middleware/user'
import usersService from './users.service'

const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = usersService.getSubmissions(req.params.username, res.locals.user)

    return res.json(submissions)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const router = Router()

router.get('/:username', user, getUserSubmissions)

export default router