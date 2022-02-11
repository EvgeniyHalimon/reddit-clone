import Axios from "axios"
import Link from "next/link"
import Head from "next/head"
import { useRouter } from "next/router"
import { FormEvent, useState } from 'react'
import UniversalInput from "../components/UniversalInput"

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<any>({})
    const router = useRouter()

    const submitForm = async (event: FormEvent) => {
        event.preventDefault()

        try {
            await Axios.post('/auth/login', 
            {
                password,
                username,
            },
            {withCredentials: true}
        )

            router.push('/')
        } catch (err) {
            setErrors(err.response.data)
        }
    }

return (
    <div className="flex bg-white">
        <Head>
            <title>Login</title>
        </Head>
        <div
            className="h-screen bg-right-bottom bg-cover w-36"
            style={{ backgroundImage: "url('/images/floppa.png')" }}
        ></div>
        <div className="flex flex-col justify-center pl-6">
            <div className="w-70">
                <h1 className="mb-2 text-lg font-medium">Log in</h1>
                <form onSubmit={submitForm}>
                    <UniversalInput
                        className="mb-2"
                        type="text"
                        value={username}
                        setValue={setUsername}
                        placeholder="USERNAME"
                        error={errors.username}
                    />
                    <UniversalInput
                        className="mb-4"
                        type="password"
                        value={password}
                        setValue={setPassword}
                        placeholder="PASSWORD"
                        error={errors.password}
                    />
                    <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
                        Log in
                    </button>
                </form>
                <small>
                    New to Floppedit?
                    <Link href="/login">
                        <a className="ml-1 text-blue-500 uppercase">Log In</a>
                    </Link>
                </small>
            </div>
        </div>
    </div>
    )
}

export default Login