import Logo from '../../public/images/floppa-logo.jpg'
import Link from 'next/link';
import Image from 'next/image';
import { useAuthDispatch, useAuthState } from '../context/auth';
import Axios from 'axios';

const Navbar: React.FC = () => {
    const { authenticated, loading } = useAuthState()

    const dispatch = useAuthDispatch()

    const logout = () => {
        Axios.get('/auth/logout')
        .then(() => {
            dispatch('LOGOUT')
            window.location.reload()
        })
        .catch(err => console.log(err))
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
                className="flex items-center mx-auto bg-gray-100 border rounded hover:bg-white hover:border-blue-500"
            >
                <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
                <input 
                    type="text" 
                    className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none" 
                    placeholder="Search"
                />
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