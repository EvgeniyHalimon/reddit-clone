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
import { useAuthState } from '../context/auth';

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
  const { authenticated } = useAuthState()
  return (
    <Fragment>
      <Head>
        <title>readit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        src={sub.imageUrl}
                        className="rounded-full cursor-pointer"
                        alt="Sub"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                    </a>
                  </Link>
                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-med">{sub.postCount}</p>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}


