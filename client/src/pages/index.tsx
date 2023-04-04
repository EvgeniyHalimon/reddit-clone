import Axios from 'axios';
import Head from 'next/head'
import { Post, Sub } from '../types';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostCard from '../components/PostCard';
import useSWR from 'swr'
import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

dayjs.extend(relativeTime)

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const posts = await Axios.get('/posts')
    console.log("🚀 ~ file: index.tsx:18 ~ constgetServerSideProps:GetServerSideProps= ~ posts:", posts.data)
    
    //!TODO
    const topSubs = await Axios.get('/misc/top-subs')
    return { props: { posts: posts.data, topSubs: topSubs.data } }
  } catch (err) {
    return { props: { error: 'Something went wrong' } }
  }
}

export default function Home({ topSubs }) {
  const { data: posts } = useSWR('/posts')
  /* console.log("🚀 ~ file: index.tsx:14 ~ Home ~ topSubs:", posts[0]) */

  return (
    <Fragment>
      <Head>
        <title>Floppa sanctuary</title>
      </Head>
      <div className="container flex pt-4">
        <div className="w-160">
          {posts?.map((post:Post) => (
            <PostCard post={post} key={post.identifier}/>
          ))}
        </div>
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="border-b-2 p4">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <>
              {topSubs?.map((sub: Sub) => (
                <div 
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <Image
                    className='rounded-full'
                    src={sub.imageUrl}
                    alt="Sub"
                    width={6*16/4}
                    height={6*16/4}
                  />
                  <Link href={`/r/${sub.name}`} >
                    <a className='ml-2 font-bold hover:cursor-pointer'>/r/{sub.name}</a>
                  </Link>
                  <p className='ml-auto font-med'>{sub.postCount}</p>
                </div>
              ))}
            </>
          </div>
        </div>
      </div>
    </Fragment>
  )
}


