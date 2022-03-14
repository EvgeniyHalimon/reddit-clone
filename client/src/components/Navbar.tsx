import Logo from '../../public/images/floppa-logo.jpg'
import Link from 'next/link';
import Image from 'next/image';
import { useAuthDispatch, useAuthState } from '../context/auth';
import Axios from 'axios';
import { Sub } from '../types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

const Navbar: React.FC = () => {
    const [name, setName] = useState('')
    const [subs, setSubs] = useState<Sub[]>([])
    const [timer, setTimer] = useState(null)

    const { authenticated, loading } = useAuthState()

    const dispatch = useAuthDispatch()

    const router = useRouter()

    const logout = () => {
        Axios.get('/auth/logout')
        .then(() => {
            dispatch('LOGOUT')
            window.location.reload()
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        if(name.trim() === ""){
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
              const { data } = await Axios.get(`/subs/search/${name}`)
              setSubs(data)
              console.log(data)
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

    return(
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white">
            <div className="flex items-center">
                <Link href="/">
                    <a className="mr-2">
                        <Image src={Logo} width={50} height={50} className="mr-10 rounded-3xl"/>
                    </a>
                </Link>
                <span className="text-2x1 font-semiblod">
                    <Link href="/">
                        Floppedit
                    </Link>
                </span>
            </div>
            <div 
                className="relative flex mx-2 items-center mx-auto bg-gray-100 border rounded hover:bg-white hover:border-blue-500"
            >
                <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
                <input
                    type="text"
                    className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
                    placeholder="Search"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="absolute left-0 right-0 bg-white" style={{top: '100%'}}>
                    {subs?.map((sub) => (
                        <div
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                            onClick={() => goToSub(sub.name)}
                            key={sub.description}
                        >
                            <Image
                                src={sub.imageUrl}
                                className="rounded-full"
                                alt="Sub"
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
            <div className="flex">
                {!loading && (authenticated ? (
                    <button 
                        className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button"
                        onClick={logout}
                    >Logout</button>
                ) : (
                    <>
                        <Link href="/login">
                            <a className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button">Log in</a>
                        </Link>
                        <Link href="/register">
                            <a className="hidden w-20 py-1 leading-5 sm:block lg:w-32 blue button">Sign up</a>
                        </Link>
                    </>
                ))}
            </div>
        </div>
    )
}

export default Navbar

