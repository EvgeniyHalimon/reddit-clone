import { getConnection } from "typeorm"
import dotenv from 'dotenv'

import { CustomError } from "../../shared/CustomError"
import Comment from "../../entities/Comment"
import { commentRepository } from "../comment/comment.repository"
import { postsRepository } from "../posts/posts.repository"
import { IPostQueries } from "../posts/types"
import Vote from "../../entities/Vote"
import { voteRepository } from "../vote/vote.repository"
import Sub from "../../entities/Sub"
import Post from "../../entities/Post"
import { LIMIT_OF_TOP_SUBS } from "../../shared/constants"

dotenv.config()

const miscService = {
    vote: async (queries) => {
        // Validate vote value
        if (![-1, 0, 1].includes(queries.value)){
            throw new CustomError({message: 'Value must be -1, 0 or 1', status: 400})
        }
        let post = await postsRepository.findPostOrFail(queries.identifier, queries.slug)
        let vote: Vote | undefined
        let comment: Comment | undefined

        if (queries.commentIdentifier) {
          // IF there is a comment identifier find vote by comment
          comment = await commentRepository.getCommentOrFail(queries.commentIdentifier)
          vote = await voteRepository.findVoteByComment(queries.user, comment)
        } else {
          // Else find vote by post
          vote = await voteRepository.findVoteByPost(queries.user, post)
        }

        if (!vote && queries.value === 0) {
          // if no vote and value = 0 return error
          throw new CustomError({message: 'Vote not found', status: 404})
        } else if (!vote) {
          // If no vote create it
          vote = new Vote({ user: queries.user, value: queries.value })
          if (comment) vote.comment = comment
          else vote.post = post
          await vote.save()
        } else if (queries.value === 0) {
          // If vote exists and value = 0 remove vote from DB
          await vote.remove()
        } else if (vote.value !== queries.value) {
          // If vote and value has changed, update vote
          vote.value = queries.value
          await vote.save()
        }

        const postQueries : IPostQueries = {
          identifier: queries.identifier,
          slug: queries.slug,
          relationsArray: ['comments', 'comments.votes', 'sub', 'votes']
        }

        post = await postsRepository.getPostOrFail(postQueries)
        post.setUserVote(queries.user)
        post.comments.forEach((c) => c.setUserVote(queries.user))
        return post
    },
    topSubs: async () => {
      /**
       * SELECT s.title, s.name,
       * COALESCE('http://localhost:5000/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y') as imageUrl,
       * count(p.id) as "postCount"
       * FROM subs s
       * LEFT JOIN posts p ON s.name = p."subName"
       * GROUP BY s.title, s.name, imageUrl
       * ORDER BY "postCount" DESC
       * LIMIT 5;
       */
      const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`
      const subs = await getConnection()
        .createQueryBuilder()
        .select(
          `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
        )
        .from(Sub, 's')
        .leftJoin(Post, 'p', `s.name = p."subName"`)
        .groupBy('s.title, s.name, "imageUrl"')
        .orderBy(`"postCount"`, 'DESC')
        .limit(LIMIT_OF_TOP_SUBS)
        .execute()
      return subs
    },
}

export default miscService