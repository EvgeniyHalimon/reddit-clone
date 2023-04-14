import { CustomError } from "../../shared/CustomError"
import { ERROR_TITLE } from "../../shared/constants"
import Comment from "../../entities/Comment"
import { commentRepository } from "../comment/comment.repository"
import { subsRepository } from "../subs/subs.repository"
import Post from "../../entities/Post"
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
        if(posts === null || undefined) throw new CustomError({ message: 'Posts not found', status: 404 })

        if (queries.user) {
          posts.forEach((p) => p.setUserVote(queries.user))
        }
        return posts
    },
    get: async (queries) => {
        const postQueries : IPostQueries = {
            identifier: queries.identifier,
            slug: queries.slug,
            relationsArray: ['sub', 'votes', 'comments']
        }
        const post = await postsRepository.getPostOrFail(postQueries)
        if(post === null || undefined) throw new CustomError({ message: 'Post not found', status: 404 })
        if (queries.user) {
          post.setUserVote(queries.user)
        }
        return post
    },
    createComment: async (queries) => {
        const post = await postsRepository.findPostOrFail(queries.identifier, queries.slug)
        if(post === null || undefined) throw new CustomError({ message: 'Post not found', status: 404 })
        const comment = new Comment({
          body: queries.body,
          user: queries.user,
          post,
        })
    
        await comment.save()

        return post
    },
    getComments: async (identifier, slug, user) => {
        const post = await postsRepository.findPostOrFail(identifier, slug)
        if(post === null || undefined) throw new CustomError({ message: 'Post not found', status: 404 })
        const comments = await commentRepository.getCommentsForPost(post)
    
        if(user) {
          comments.forEach((c) => c.setUserVote(user))
        }

        return comments
    }
}

export default postsService