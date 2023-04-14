import Axios from 'axios'
import Link from 'next/link'
import { Fragment, useContext, useEffect, useState } from 'react'
import Image from 'next/image'

import { AuthContext } from '../context/auth'

import Logo from '../../public/images/floppa-logo.jpg'
import { Sub } from '../types'
import { useRouter } from 'next/router'
import { removeTokens } from '../utils/tokensWorkshop'
import { get } from '../utils/api'

const Navbar: React.FC = () => {
  const [name, setName] = useState('')
  const [subs, setSubs] = useState<Sub[]>([])
  const [timer, setTimer] = useState(null)

  const { token, setToken } = useContext(AuthContext);

  const router = useRouter()

  const logout = () => {
    setToken(null);
    removeTokens();
  };

  useEffect(() => {
    if (name.trim() === '') {
      setSubs([])
      return
    }
    searchSubs()
  }, [name])

  const searchSubs = async () => {
    clearTimeout(timer)
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await get(`/subs/search/${name}`)
          setSubs(data)
        } catch (err) {
          console.log(err)
        }
      }, 250)
    )
  }

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`)
    setName('')
  }

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white">
      {/* Logo and title */}
      <div className="flex items-center">
        <Link href="/">
            <a className="mr-2">
                <Image src={Logo} width={50} height={50} alt='logo' className="mr-10 rounded-3xl"/>
            </a>
        </Link>
        <span className="hidden text-2xl font-semibold lg:block">
          <Link href="/">Floppedit</Link>
        </span>
      </div>
      {/* Search Input */}
      <div className="max-w-full px-4 w-160">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search "></i>
          <input
            type="text"
            className="py-1 pr-3 bg-transparent rounded focus:outline-none"
            placeholder="Search"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div
            className="absolute left-0 right-0 bg-white"
            style={{ top: '100%' }}
          >
            {subs?.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => goToSub(sub.name)}
              >
                <Image
                  src={sub.imageUrl}
                  className="rounded-full"
                  alt={sub.name + '-pic'}
                  height={(8 * 16) / 4}
                  width={(8 * 16) / 4}
                />
                <div className="ml-4 text-sm">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-gray-600">{sub.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Auth buttons */}
      <div className="flex">
          {token ? (
            // Show logout
            <button
              className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button">
                  log in
                </a>
              </Link>
              <Link href="/register">
                <a className="hidden w-20 py-1 leading-5 sm:block lg:w-32 blue button">
                  sign up
                </a>
              </Link>
            </Fragment>
          )}
      </div>
    </div>
  )
}

export default Navbar