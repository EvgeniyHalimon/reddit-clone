import { Request, Response, Router } from 'express'

import auth from '../../shared/middleware/auth'
import user from '../../shared/middleware/user'
import miscService from './misc.service'

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body
  const queries = {
    identifier: identifier,
    slug: slug,
    commentIdentifier: commentIdentifier,
    value: value,
    user: res.locals.user
  }
  try {
    const post = await miscService.vote(queries)
    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const topSubs = async (_: Request, res: Response) => {
  try {
    const subs = await miscService.topSubs()
    return res.json(subs)
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const router = Router()
router.post('/vote', user, auth, vote)
router.get('/top-subs', topSubs)

export default router