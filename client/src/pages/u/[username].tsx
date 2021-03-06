/* eslint-disable react-hooks/rules-of-hooks */
import Axios from "axios";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, createRef } from "react";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import { Comment, Post, User } from "../../types";
import Image from "next/image";

export default function user() {
    const router = useRouter()
    const username = router.query.username

    const fileInputRef = createRef<HTMLInputElement>()
    
    const openFileInput = (type: string) => {
        fileInputRef.current.name = type
        fileInputRef.current.click()
    }
    
    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0]
    
        const formData = new FormData()
        formData.append('file', file) 
        formData.append('type', fileInputRef.current.name)
    
        try {
          await Axios.post<User>(`users/${username}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
    
          revalidate()
        } catch (err) {
          console.log(err)
        }
      }

    const {data, error, revalidate} = useSWR<any>(username ? `/users/${username}` : null)
    if(error) return router.push('/')
    if(data) console.log(data)
    
    return(
        <>
            <Head>
                <title>{data?.user.username}</title>
            </Head>
            {data && (
                <div className="container flex pt-5 px-5">
                    <div className="w-160">
                        {data.submissions.map((submission: any) => {
                            if(submission.type === "Post"){
                                const post: Post = submission
                                return <PostCard key={post.identifier} post={submission}/>
                            } else {
                                const comment: Comment = submission
                                return (
                                    <div 
                                        key={comment.identifier}
                                        className="flex my-4 bg-white rounded"
                                    >
                                        <div className="flex-shrink-0 w-10 py-4 text-center rounded-l">
                                            <i className="fas fa-comment-alt fa-xs text-gray-400">

                                            </i>
                                        </div>
                                        <div className="w-full p-2">
                                            <p className="mb-2 text-xs text-gray-500">
                                                <Link href={`/u/${comment.username}`}>
                                                    <a className="text-blue-500 hover:underline cursor-pointer">
                                                        {comment.username}
                                                    </a>
                                                </Link>
                                                <span> commented on </span>
                                                <Link href={comment.post.url}>
                                                    <a className="font-semibold hover:underline cursor-pointer">
                                                        {comment.post.title}
                                                    </a>
                                                </Link>
                                                <span className="mx-1">???</span>
                                                <Link href={`/r/${comment.post.subName}`}>
                                                    <a className="text-black hover:underline cursor-pointer">
                                                        /r/{comment.post.subName}
                                                    </a>
                                                </Link>
                                            </p>
                                            <hr/>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <div className="w-80 ml-6">
                    <input
                        type="file"
                        hidden={true}
                        ref={fileInputRef}
                        onChange={uploadImage}
                    />
                        <div className="ml-6 w-80">
                            <div className="bg-white rounded">
                            <div className="p-3 bg-blue-500 rounded-t text-center">
                                <Image
                                    src={data.user.avatarUrl}
                                    alt="user profile"
                                    className='w-16 h-16 mx-0 border-2 border-white rounded-full cursor-pointer'
                                    onClick={() => openFileInput('image')}
                                    width={70}
                                    height={70}
                                />
                            </div>
                            <div className="p-3 text-center">
                                <h1 className="mb-3 text-xl">{data.user.username}</h1>
                                <hr />
                                <p className="mt-3">
                                    Joined {dayjs(data.user.createdAt).format('MMM YYYY')}
                                </p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
