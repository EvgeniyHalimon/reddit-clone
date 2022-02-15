import Axios from 'axios';
import Head from 'next/head'
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { Post } from '../types';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    Axios.get('/posts')
    .then(res => setPosts(res.data))
    .catch(err => console.log(err))
  },[])

  return (
    <div className="pt-20">
      <Head>
        <title>Floppa sanctuary</title>
      </Head>
      <div className="container flex pt-4">
        <div className="w-160">
          {posts.map((post:Post) => (
            <div
              key={post.identifier}
              className="flex mb-4 bg-white rounded"
            >
              <div className="w-10 text-center bg-gray-200 rounded-l">
                <p>V</p>
              </div>
              <div className="w-full p-2">
                <div className="flex items-center">
                  <Link href={`/r/${post.subName}`}>
                    <Fragment>
                      <img className="w-6 h-6 mr-1 rounded-full cursor-pointer" src="https://play-lh.googleusercontent.com/70v2P2iEq51cg0j6oYMDjVOPOPCGfuYeqJDEn4n27W9BRm-xW-9Pb96k-0Q3c8qPhKUB" alt="subpic"/>
                      <a className="text-xs font-bold cursor-pointer hover:underline">
                        /r/{post.subName}
                      </a>
                    </Fragment>
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
                      <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span className="font-bold">20 Comments</span>
                      </div>
                    </a>
                  </Link>
                  <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-share fa-xs"></i>
                    <span className="font-bold">Share</span>
                  </div>
                  <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-bookmark fa-xs"></i>
                    <span className="font-bold">Save</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get('/posts')

//     return { props: { posts: res.data } }
//   } catch (err) {
//     return { props: { error: 'Something went wrong' } }
//   }
// }