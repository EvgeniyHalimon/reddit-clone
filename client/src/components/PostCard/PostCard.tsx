import Link from "next/link"
import { Post } from "../../types";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ActionButton from '../ActionButton';
import Axios  from 'axios';
import { useAuthState } from "../../context/auth";
import { useRouter } from "next/router";
import Image from "next/image";
import VoteSection from "./VoteSection";
import CommentSection from "./CommentSection";

dayjs.extend(relativeTime)

interface IPostCard{
    post: Post,
    mutate?(): any
}

const PostCard: React.FC<IPostCard> = ({ post, mutate }) => {

    const router = useRouter()

    const isInSubPage = router.pathname === '/r/[sub]'

    return(
        <div
            key={post.identifier}
            className="flex mb-4 bg-white rounded"
            id={post.identifier}
        >
            <VoteSection 
                post={post} 
                mutate={mutate}
            />
            <div className="w-full p-2">
                <div className="flex items-center">
                    {!isInSubPage && 
                    <>
                        <Link href={`/r/${post.subName}`}>
                            <Image 
                                className="w-6 h-6 rounded-full cursor-pointer" 
                                /* src="https://play-lh.googleusercontent.com/70v2P2iEq51cg0j6oYMDjVOPOPCGfuYeqJDEn4n27W9BRm-xW-9Pb96k-0Q3c8qPhKUB"  */
                                src={post.sub.imageUrl}
                                alt={post.subName + '-pic'}
                                width={20}
                                height={20}
                            />
                        </Link>
                        <Link href={`/r/${post.subName}`}>
                            <a className="ml-1 text-xs font-bold cursor-pointer hover:underline">
                                /r/{post.subName}
                            </a>
                        </Link>
                      <span className="mx-1">&#8226;</span>
                    </>
                    }
                    <p className="text-xs text-gray-600">
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
                <CommentSection post={post} />
            </div>
        </div>
    )
}

export default PostCard