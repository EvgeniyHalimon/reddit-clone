import { FC, memo, useContext, useState } from 'react'
import { AuthContext } from '../../context/auth'
import { useRouter } from 'next/router'
import Axios from 'axios'
import { Post, Comment } from '../../types'
import { post } from '../../utils/api'

interface IVoteSection{
    currentPost: Post,
    mutate(): any,
    slug?: boolean
}

const VoteSection: FC<IVoteSection> = ({ currentPost, mutate, slug }) => {

    const [score, setScore] = useState(currentPost?.voteScore)

    const { token } = useContext(AuthContext);

    const router = useRouter()

    const vote = async (value: number, comment?: Comment) => {
        if(!token) router.push('/login')
        // If vote is the same reset vote
        if (
        (!comment && value === currentPost?.userVote) ||
        (comment && comment?.userVote === value)
        )
        value = 0
        try {
            const data = await post('/misc/vote', {
                identifier : currentPost?.identifier,
                slug: currentPost?.slug,
                value: value
            })

            if(mutate) mutate()
            setScore(data.data.voteScore)
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className={!slug ? 'w-10 py-3 text-center bg-gray-200 rounded-l' : 'flex-shrink-0 w-10 py-2 text-center rounded-l'}>
        <div
            className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
            onClick={() => vote(1)}
        >
          <i className={`icon-arrow-up ${currentPost?.userVote == 1 ? 'text-red-500' : null}`}></i>
        </div>
        <p className="text-xs font-bold">{score}</p>
        <div 
            className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
            onClick={() => vote(-1)}
        >
          <i className={`icon-arrow-down ${currentPost?.userVote == -1 ? 'text-blue-600' : null}`}></i>
        </div>
    </div>
  )
}

export default memo(VoteSection)