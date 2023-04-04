import Link from "next/link"
import { Post } from "../types";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ActionButton from './ActionButton';
import Axios  from 'axios';
import classNames from 'classnames';

dayjs.extend(relativeTime)

interface IPostCard{
    post: Post
}

const PostCard: React.FC<IPostCard> = ({ post }) => {

    const vote = async (value) => {
        try {
            const res = await Axios.post('/misc/vote', {
                identifier : post.identifier,
                slug: post.slug,
                value: value
            })
            console.log(res.data);
            
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div
            key={post.identifier}
            className="flex mb-4 bg-white rounded"
        >
            <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
                <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    onClick={() => vote(1)}
                >
                    <i className={`icon-arrow-up ${post.userVote == 1 ? 'text-red-500' : null}`}></i>
                </div>
                <p className="text-xs font-bold">{post.voteScore}</p>
                <div 
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                    onClick={() => vote(-1)}
                >
                    <i className={`icon-arrow-down ${post.userVote == -1 ? 'text-blue-600' : null}`}></i>
                </div>
            </div>
            <div className="w-full p-2">
                <div className="flex items-center">
                    <Link href={`/r/${post.subName}`}>
                        <img className="w-6 h-6 mr-1 rounded-full cursor-pointer" src="https://play-lh.googleusercontent.com/70v2P2iEq51cg0j6oYMDjVOPOPCGfuYeqJDEn4n27W9BRm-xW-9Pb96k-0Q3c8qPhKUB" alt="subpic"/>
                    </Link>
                    <Link href={`/r/${post.subName}`}>
                        <a className="text-xs font-bold cursor-pointer hover:underline">
                            /r/{post.subName}
                        </a>
                    </Link>
                    <p className="text-xs text-gray-600">
                        <span className="mx-1">&#8226;</span>
                        Posted by
                        <Link href={`/u/${post.username}`}>
                            <a className="mx-1 hover:underline">
                                /u/{post.username}
                            </a>
                        </Link>
                        <Link href={post.url}>
                            <a className="mx-1 hover:underline">
                                {dayjs(post.createdAt).fromNow()}
                            </a>
                        </Link>
                    </p>
                </div>
                <Link href={post.url}>
                    <a className="my-1 text-lg font-medium">
                        {post.title}
                    </a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}
                <div className="flex">
                    <Link href={post.url}>
                        <a>
                        <ActionButton>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">{post.commentCount} Comments</span>
                        </ActionButton>
                        </a>
                    </Link>
                    <ActionButton>
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                    </ActionButton>
                    <ActionButton>
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                    </ActionButton>
                </div>
            </div>
        </div>
    )
}

export default PostCard