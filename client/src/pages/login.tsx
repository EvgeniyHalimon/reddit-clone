import Axios from "axios"
import Link from "next/link"
import Head from "next/head"
import { useRouter } from "next/router"
import { FormEvent, useRef, useState } from 'react'
import UniversalInput from "../components/UniversalInput"
import { useAuthDispatch, useAuthState } from "../context/auth"
import AuthBackground from "../components/AuthBackground"
import SubmitButton from "../components/SubmitButton"

//!TODO: refactor form
const Login = () => {
    const usernameRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const [errors, setErrors] = useState<any>({})

    const dispatch = useAuthDispatch()
    const {authenticated} = useAuthState()
    
    const router = useRouter()
    console.log("🚀 ~ file: login.tsx:19 ~ Login ~ router:", usernameRef, passwordRef)
    if(authenticated) router.push("/")
    
    const submitForm = async (event: FormEvent) => {
        event.preventDefault()
        
        try {
            const res = await Axios.post('/auth/login',{
                username: usernameRef.current.value,
                password: passwordRef.current.value,
            })
            dispatch('LOGIN',res.data)
            router.push("/")
            usernameRef.current.value = ''
            passwordRef.current.value = ''
        } catch (err) {
            setErrors(err.response.data)
        }
    }

return (
    <div className="flex bg-white">
        <Head>
            <title>Login</title>
        </Head>
        <AuthBackground/>
        <div className="flex flex-col justify-center pl-6">
            <div className="w-70">
                <h1 className="mb-2 text-lg font-medium">Log in</h1>
                <form onSubmit={submitForm}>
                    <UniversalInput
                        className="mb-2"
                        type="text"
                        refs={usernameRef}
                        placeholder="USERNAME"
                        error={errors.username}
                    />
                    <UniversalInput
                        className="mb-4"
                        type="password"
                        refs={passwordRef}
                        placeholder="PASSWORD"
                        error={errors.password}
                    />
                    <SubmitButton buttonText="Log in"/>
                </form>
                <small>
                    New to Floppedit?
                    <Link href="/register">
                        <a className="ml-1 text-blue-500 uppercase">Sign up</a>
                    </Link>
                </small>
            </div>
        </div>
    </div>
    )
}

export default Login