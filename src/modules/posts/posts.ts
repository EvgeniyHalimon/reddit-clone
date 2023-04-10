import { Router, Request, Response } from 'express'

import Comment from '../comment/comment.entity'
import Post from './posts.entity'
import Sub from '../subs/subs.entity'
import auth from '../../middleware/auth'
import user from '../../middleware/user'
import { postsRepository } from './posts.repository'
import { IPostQueries } from './types'
import { subsRepository } from '../subs/subs.repository'
import { commentRepository } from '../comment/comment.repository'

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body

  const user = res.locals.user

  if (title.trim() === '') {
    return res.status(400).json({ title: 'Title must not be empty' })
  }

  try {
    // find sub
    const subRecord = await subsRepository.findSubOfFail(sub)

    const post = new Post({ title, body, user, sub: subRecord })
    await post.save()

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const getPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0)  as number
  const postsPerPage: number = (req.query.count || 8) as number
  try {
    const posts = await postsRepository.getAllPosts(currentPage, postsPerPage)

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user))
    }

    return res.json(posts)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  try {
    const queries : IPostQueries = {
      identifier: identifier,
      slug: slug,
      relationsArray: ['sub', 'votes', 'comments']
    }
    const post = await postsRepository.getPostOrFail(queries)

    if (res.locals.user) {
      post.setUserVote(res.locals.user)
    }

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: 'Post not found' })
  }
}

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  const body = req.body.body

  try {
    const post = await postsRepository.findPostOrFail(identifier, slug)

    const comment = new Comment({
      body,
      user: res.locals.user,
      post,
    })

    await comment.save()

    return res.json(comment)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: 'Post not found' })
  }
}

const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  try {
    const post = await postsRepository.findPostOrFail(identifier, slug)

    const comments = await commentRepository.getCommentsForPost(post)

    if (res.locals.user) {
      comments.forEach((c) => c.setUserVote(res.locals.user))
    }

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