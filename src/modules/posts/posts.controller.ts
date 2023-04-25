import { Router, Request, Response } from 'express'

import auth from '../../shared/middleware/auth'
import user from '../../shared/middleware/user'
import postsService from './posts.service'
import { CustomRequest } from '../../shared/types'


const createPost = async (req: CustomRequest, res: Response) => {
  const { title, body, sub } = req.body
  console.log("🚀 ~ file: posts.controller.ts:11 ~ createPost ~ title, body, sub:", title, body, sub)
  const queries = {
    title: title,
    body: body,
    sub: sub,
    user: req.user
  }
  try {
    const post = await postsService.create(queries)
    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const getPosts = async (req: CustomRequest, res: Response) => {
  console.log("🚀 ~ file: posts.controller.ts:27 ~ getPosts ~ req:", req.user)
  const currentPage: number = (req.query.page || 0)  as number
  const postsPerPage: number = (req.query.count || 8) as number
  const queries = {
    currentPage: currentPage,
    postsPerPage: postsPerPage,
    user: req.user,
  }
  try {
    const posts = await postsService.getAll(queries)
    return res.json(posts)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const getPost = async (req: CustomRequest, res: Response) => {
  const { identifier, slug } = req.params
  try {
    const queries = {
      identifier: identifier,
      slug: slug,
      user: req.user,
    }
    const post = await postsService.get(queries)
    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const commentOnPost = async (req: CustomRequest, res: Response) => {
  const { identifier, slug } = req.params
  const queries = {
    identifier: identifier,
    slug: slug,
    body: req.body.body,
    user: req.user,
  }
  try {
    const comment = await postsService.createComment(queries)
    return res.json(comment)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const getPostComments = async (req: CustomRequest, res: Response) => {
  const { identifier, slug } = req.params
  try {
    const comments = await postsService.getComments(identifier, slug, req.user)
    return res.json(comments)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const router = Router()

router.post('/', createPost)
router.get('/', getPosts)
router.get('/:identifier/:slug', getPost)
router.post('/:identifier/:slug/comments', commentOnPost)
router.get('/:identifier/:slug/comments', getPostComments)

export default router