import Post from "./posts.entity";

export interface IPostQueries{
    identifier: string,
    slug: string,
    relationsArray: (keyof Post)[] | string[]
}