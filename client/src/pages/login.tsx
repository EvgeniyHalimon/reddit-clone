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
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<any>({})

    const dispatch = useAuthDispatch()
    const {authenticated} = useAuthState()
    
    const router = useRouter()
    if(authenticated) router.push("/")
    
    const submitForm = async (event: FormEvent) => {
        event.preventDefault()
        
        try {
            const res = await Axios.post('/auth/login',{
                username,
                password,
            })
            console.log("🚀 ~ file: login.tsx:31 ~ submitForm ~ res:", res)
            dispatch('LOGIN',res.data)
            if(res.status === 200) router.push("/")
        } catch (err) {
            console.log("🚀 ~ file: login.tsx:37 ~ submitForm ~ err:", err)
            setErrors(err?.response?.data)
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
                        value={username}
                        placeholder="USERNAME"
                        error={errors?.username}
                        setValue={setUsername}
                    />
                    <UniversalInput
                        className="mb-4"
                        type="password"
                        value={password}
                        placeholder="PASSWORD"
                        error={errors?.password}
                        setValue={setPassword}
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