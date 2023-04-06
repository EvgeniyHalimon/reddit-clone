import { FC } from 'react'
import { Post } from '../../types'
import Link from 'next/link'
import ActionButton from '../ActionButton'

interface ICommentSection{
    post: Post
}

const CommentSection: FC<ICommentSection> = ({ post }) => {
  return (
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
  )
}

export default CommentSection