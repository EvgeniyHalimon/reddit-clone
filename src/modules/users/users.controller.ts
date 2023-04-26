import { Request, Response, Router } from 'express'

import usersService from './users.service'

const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await usersService.getSubmissions(req.params.username, res.locals.user)
    return res.json(submissions)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const router = Router()

router.get('/:username', getUserSubmissions)

export default router