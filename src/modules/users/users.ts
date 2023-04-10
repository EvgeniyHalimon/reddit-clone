import { Request, Response, Router } from 'express'

import Comment from '../comment/comment.entity'
import user from '../../middleware/user'
import { userRepository } from '../auth/auth.repository'
import { postsRepository } from '../posts/posts.repository'
import { commentRepository } from '../comment/comment.repository'

const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const user = await userRepository.findUserOrFail(req.params.username, ['username', 'createdAt'])

    const posts = await postsRepository.findUserPosts(user)

    const comments = await commentRepository.getUserComments(user)

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user))
      comments.forEach((c) => c.setUserVote(res.locals.user))
    }

    let submissions: any[] = []
    posts.forEach((p) => submissions.push({ type: 'Post', ...p.toJSON() }))
    comments.forEach((c) =>
      submissions.push({ type: 'Comment', ...c.toJSON() })
    )

    submissions.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1
      if (b.createdAt < a.createdAt) return -1
      return 0
    })

    return res.json({ user, submissions })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const router = Router()

router.get('/:username', user, getUserSubmissions)

export default router