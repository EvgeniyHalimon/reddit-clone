import { CustomError } from "../../shared/CustomError"
import { userRepository } from "../auth/auth.repository"
import { commentRepository } from "../comment/comment.repository"
import { postsRepository } from "../posts/posts.repository"

const usersService = {
    getSubmissions: async (username, localUser) => {
        const user = await userRepository.findUserOrFail(username, ['username', 'createdAt'])
        if (user) {
            throw new CustomError({ message: 'User not found', status: 404 })
        }
        const posts = await postsRepository.findUserPosts(user)

        const comments = await commentRepository.getUserComments(user)

        if (localUser) {
          posts.forEach((p) => p.setUserVote(localUser))
          comments.forEach((c) => c.setUserVote(localUser))
        }

        let submissions: any[] = []
        posts.forEach((p) => submissions.push({ type: 'Post', ...p.toJSON() }))
        comments.forEach((c) =>
          submissions.push({ type: 'Comment', ...c.toJSON() })
        )

        submissions.sort((a, b) => {
          /* if (b.createdAt > a.createdAt) return 1
          if (b.createdAt < a.createdAt) return -1
          return 0 */
          return a.createdAt.localeCompare(b.createdAt);
        })

        return { user, submissions }
    }
}

export default usersService