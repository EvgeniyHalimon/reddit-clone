import Axios from 'axios';
import Head from 'next/head'
import { Post } from '../types';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostCard from '../components/PostCard';
import useSWR from 'swr'
import { Fragment } from 'react';
import { GetServerSideProps } from 'next';

dayjs.extend(relativeTime)

export default function Home({ posts }) {
  /* const { data: posts } = useSWR('/posts') */

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
      </div>
    </Fragment>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await Axios.get('/posts')
    return { props: { posts: res.data } }
  } catch (err) {
    return { props: { error: 'Something went wrong' } }
  }
}