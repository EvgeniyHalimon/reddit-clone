import Comment from "../../entities/Comment";
import Post from "../../entities/Post";
import User from "../../entities/User";
import Vote from "../../entities/Vote";

const voteRepository = {
  findVoteByComment: async (user: User, comment: Comment) => {
    return await Vote.findOne({ user, comment })
  },
  findVoteByPost: async (user: User, post: Post) => {
    return await Vote.findOne({ user, post })
  },
};

export { voteRepository };