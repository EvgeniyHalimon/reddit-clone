import { CustomError } from "../../shared/CustomError"
import { ERROR_TITLE } from "../../shared/constants"
import Comment from "../comment/comment.entity"
import { commentRepository } from "../comment/comment.repository"
import { subsRepository } from "../subs/subs.repository"
import Post from "./posts.entity"
import { postsRepository } from "./posts.repository"
import { IPostQueries } from "./types"

const postsService = {
    create: async (queries) => {
        if (queries.title.trim() === '') {
            throw new CustomError({ message: ERROR_TITLE, status: 400 })
        }
        // find sub
        const subRecord = await subsRepository.findSubOfFail(queries.sub)
        
        const post = new Post({ 
            title: queries.title, 
            body: queries.body, 
            user: queries.user, 
            sub: subRecord 
        })
        await post.save()
    },
    getAll: async (queries) => {
        const posts = await postsRepository.getAllPosts(queries.currentPage, queries.postsPerPage)

        if (queries.user) {
          posts.forEach((p) => p.setUserVote(queries.user))
        }
    },
    get: async (queries) => {
        const postQueries : IPostQueries = {
            identifier: queries.identifier,
            slug: queries.slug,
            relationsArray: ['sub', 'votes', 'comments']
        }
        const post = await postsRepository.getPostOrFail(postQueries)
      
        if (queries.user) {
          post.setUserVote(queries.user)
        }
    },
    createComment: async (queries) => {
        const post = await postsRepository.findPostOrFail(queries.identifier, queries.slug)

        const comment = new Comment({
          body: queries.body,
          user: queries.user,
          post,
        })
    
        await comment.save()
    },
    getComments: async (identifier, slug, user) => {
        const post = await postsRepository.findPostOrFail(identifier, slug)

        const comments = await commentRepository.getCommentsForPost(post)
    
        if (user) {
          comments.forEach((c) => c.setUserVote(user))
        }
    }
}

export default postsService