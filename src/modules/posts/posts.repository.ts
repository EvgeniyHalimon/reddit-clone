import Post from "../../entities/Post";
import Sub from "../../entities/Sub";
import User from "../../entities/User";
import { IPostQueries } from "./types";

const postsRepository = {
  getAllPosts: async (currentPage: number, postsPerPage: number) => {
    return await Post.find({
      order: { createdAt: 'DESC' },
      relations: ['sub', 'votes', 'comments'],
      skip: currentPage * postsPerPage,
      take: postsPerPage
    })
  },
  getPostOrFail: async (queries: IPostQueries) => {
    return await Post.findOneOrFail(
      { identifier: queries.identifier, slug: queries.slug },
      { relations: [...queries.relationsArray] }
    )
  },
  findPostOrFail: async (identifier: string, slug: string) => {
    return await Post.findOneOrFail({ identifier, slug })
  },
  findPostInSub: async (sub: Sub) => {
    return await Post.find({
      where: { sub },
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
    })
  },
  findUserPosts: async (user: User) => {
    return await Post.find({
      where: { user },
      relations: ['comments', 'votes', 'sub'],
    })
  }
};

export { postsRepository };