import Post from "../../entities/Post";

export interface IPostQueries{
    identifier: string,
    slug: string,
    relationsArray: (keyof Post)[] | string[]
}