import { Router, Request, Response } from 'express'

import auth from '../../shared/middleware/auth'
import user from '../../shared/middleware/user'
import postsService from './posts.service'

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body
  const queries = {
    title: title,
    body: body,
    sub: sub,
    user: res.locals.user
  }
  try {
    const post = await postsService.create(queries)
    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const getPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0)  as number
  const postsPerPage: number = (req.query.count || 8) as number
  const queries = {
    currentPage: currentPage,
    postsPerPage: postsPerPage,
    user: res.locals.user,
  }
  try {
    const posts = await postsService.getAll(queries)
    return res.json(posts)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  try {
    const queries = {
      identifier: identifier,
      slug: slug,
      user: res.locals.user,
    }
    const post = await postsService.get(queries)
    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: 'Post not found' })
  }
}

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  const body = req.body.body
  const queries = {
    identifier: identifier,
    slug: slug,
    body: body,
    user: res.locals.user,
  }
  try {
    const comment = await postsService.createComment(queries)
    return res.json(comment)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: 'Post not found' })
  }
}

const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  try {
    const comments = await postsService.getComments(identifier, slug, res.locals.user)

    return res.json(comments)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const router = Router()

router.post('/', user, auth, createPost)
router.get('/', user, getPosts)
router.get('/:identifier/:slug', user, getPost)
router.post('/:identifier/:slug/comments', user, auth, commentOnPost)
router.get('/:identifier/:slug/comments', user, getPostComments)

export default router