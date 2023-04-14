import Head from 'next/head'
import { Post } from '../types';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostCard from '../components/PostCard/PostCard';
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { Fragment, useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AuthContext } from '../context/auth';
import { axiosInstance, get } from '../utils/api';
import { SSR_TOP_SUBS } from '../constants/backendConstants';
import { getAccessToken } from '../utils/tokensWorkshop';

dayjs.extend(relativeTime)

const metaDescription = '/b'
const metaTitle = 'Floppedit: the front page of the internet'


export const getServerSideProps: GetServerSideProps = async (context) => {
  context.req.headers.authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDQtMDNUMTg6MDI6MTEuMTc5WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDQtMDNUMTg6MDI6MTEuMTc5WiIsImVtYWlsIjoic0BtYWlsLmNvbSIsInVzZXJuYW1lIjoiZWxmIn0sImlhdCI6MTY4MTQ5MjAyMywiZXhwIjoxNjgxNDk1NjIzfQ.K6dQ5wso2xzwUwr67RkC-Azp1Wsg0YNGkRrRU6sJ9WU`
  console.log("🚀 ~ file: index.tsx:24 ~ constgetServerSideProps:GetServerSideProps= ~ context:", context.req.headers.authorization)
  console.log('object');
  try {
    //!TODO find solution
    const topSubs:any = await fetch(SSR_TOP_SUBS, {headers: {Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDQtMDNUMTg6MDI6MTEuMTc5WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDQtMDNUMTg6MDI6MTEuMTc5WiIsImVtYWlsIjoic0BtYWlsLmNvbSIsInVzZXJuYW1lIjoiZWxmIn0sImlhdCI6MTY4MTQ5MjAyMywiZXhwIjoxNjgxNDk1NjIzfQ.K6dQ5wso2xzwUwr67RkC-Azp1Wsg0YNGkRrRU6sJ9WU`}})
    const data:any = await topSubs.json()
    console.log("🚀 ~ file: index.tsx:31 ~ constgetServerSideProps:GetServerSideProps= ~ topSubs:", data)
    return { props: { dag : data, test: 'm kfm kmfk mfkm kfmk mfk mkfm ' } }
  } catch (err) {
    console.log("🚀 ~ file: index.tsx:37 ~ constgetServerSideProps:GetServerSideProps= ~ err:", err)
    return { props: { error: 'Something went wrong' } }
  }
}

export default function Home({dag}) {
  console.log("🚀 ~ file: index.tsx:36 ~ Home ~ dag:", dag)
  const [observerdPost, setObservedPost] = useState('')
  const { data: topSubs } = useSWR('misc/top-subs')
  const { token } = useContext(AuthContext);
  const { data, error, mutate, size: page, setSize: setPage } = useSWRInfinite((index) => `/posts?page=${index}`)

  const posts: Post[] = data ? [].concat(...data) : [];
  const isInitialLoading = !data && !error

  const observeElement = (element: HTMLElement) => {
    if(!element) return
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting === true){
        console.log('BOTTOM');
        observer.unobserve(element)
        setPage(page + 1)
      }
    }, {threshold : 1})
    observer.observe(element)
  }

  useEffect(() => {
    if(!posts || posts.length === 0) return
    const id = posts[posts.length - 1].identifier
    if(id !== observerdPost){
      setObservedPost(id)
      observeElement(document.getElementById(id))
    }
    
    console.log(getAccessToken())
  }, [posts])
  
  return (
    <Fragment>
      <Head>
        <title>Floppedit: the front page of the internet</title>
        <meta property='og:title' content={`@${metaTitle}`}/>
        <meta name="og:description" content={metaDescription} />
        <meta property='twitter:title' content={metaTitle}/>
        <meta name="twitter:description" content={metaDescription} />
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {isInitialLoading && <p className="text-lg text-center">Loading..</p>}
          {posts?.map((post) => (
            <PostCard post={post} key={`${post.identifier}${post.title}`} mutate={mutate}/>
          ))}
          {isInitialLoading && posts.length > 0 && <p className="text-lg text-center">Loading more..</p>}
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
              {topSubs?.map((sub: any) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        src={sub.imageUrl}
                        className="rounded-full cursor-pointer"
                        alt={sub.name + '-pic'}
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
            {token && (
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




