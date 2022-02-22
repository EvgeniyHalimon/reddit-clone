import Axios from 'axios';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { Post } from '../types';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostCard from '../components/PostCard';

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
            <PostCard post={post} key={post.identifier}/>
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