import { Request, Response, Router } from 'express'

import miscService from './misc.service'
import { CustomRequest } from '../../shared/types'


const vote = async (req: CustomRequest, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body
  const queries = {
    identifier: identifier,
    slug: slug,
    commentIdentifier: commentIdentifier,
    value: value,
    user: req.user
  }
  try {
    const post = await miscService.vote(queries)
    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const topSubs = async (_: Request, res: Response) => {
  try {
    const subs = await miscService.topSubs()
    return res.json(subs)
  } catch (err) {
    return res.status(err.status).json({ error: err.message })
  }
}

const router = Router()
router.post('/vote', vote)
router.get('/top-subs', topSubs)

export default router