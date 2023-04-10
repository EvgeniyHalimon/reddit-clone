import Comment from "../comment/comment.entity";
import Post from "../posts/posts.entity";
import User from "../users/users.entity";
import Vote from "./vote.entity";

const voteRepository = {
  findVoteByComment: async (user: User, comment: Comment) => {
    return await Vote.findOne({ user, comment })
  },
  findVoteByPost: async (user: User, post: Post) => {
    return await Vote.findOne({ user, post })
  },
};

export { voteRepository };