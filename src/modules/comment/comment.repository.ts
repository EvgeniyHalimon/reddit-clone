import Comment from "../../entities/Comment";
import Post from "../../entities/Post";
import User from "../../entities/User";

const commentRepository = {
  getCommentsForPost: async (post: Post) => {
    return await Comment.find({
        where: { post },
        order: { createdAt: 'DESC' },
        relations: ['votes'],
    })
  },
  getUserComments: async (user: User) => {
    return await Comment.find({
        where: { user },
        relations: ['post'],
    })
  },
  getCommentOrFail: async (identifier: string) => {
    return await Comment.findOneOrFail({ identifier: identifier })
  }
};

export { commentRepository };