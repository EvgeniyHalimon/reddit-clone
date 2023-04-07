import { FormEvent, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Axios from 'axios'
import { useRouter } from 'next/router'
import UniversalInput from '../components/UniversalInput'
import { useAuthState } from '../context/auth'
import AuthBackground from '../components/AuthBackground'
import ErrorMessage from '../components/ErrorMessage'
import SubmitButton from '../components/SubmitButton'

//!TODO: refactor form
export default function Register() {
    const emailRef = useRef<HTMLInputElement | null>(null)
    const usernameRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const [agreement, setAgreement] = useState(false)
    const [errors, setErrors] = useState<any>({})
    const router = useRouter()

    const {authenticated} = useAuthState()

    if(authenticated) router.push("/")

    const submitForm = async (event: FormEvent) => {
        event.preventDefault()
    
        if (!agreement) {
            setErrors({ ...errors, agreement: 'You must agree to T&Cs' })
            return
        }
    
        try {
            await Axios.post('/auth/register', {
                email: emailRef.current.value,
                password: passwordRef.current.value,
                username: usernameRef.current.value,
            })
            emailRef.current.value = ''
            passwordRef.current.value = ''
            usernameRef.current.value = ''
            router.push('/login')
        } catch (err) {
            setErrors(err)
        }
    }

return (
    <div className="flex bg-white">
        <Head>
            <title>Register</title>
        </Head>
        <AuthBackground/>
        <div className="flex flex-col justify-center pl-6">
            <div className="w-70">
                <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
                <p className="mb-10 text-xs">
                    By continuing, you agree to our User Agreement and Privacy Policy
                </p>
                <form onSubmit={submitForm}>
                    <div className="mb-6">
                        <input
                            type="checkbox"
                            className="mr-1 cursor-pointer"
                            id="agreement"
                            checked={agreement}
                            onChange={(e) => setAgreement(e.target.checked)}
                        />
                        <label htmlFor="agreement" className="text-xs cursor-pointer">
                            I agree to get emails about cool stuff on Floppedit
                        </label>
                        <ErrorMessage error={errors.agreement}/>
                    </div>
                    <UniversalInput
                        className="mb-2"
                        type="email"
                        refs={emailRef}
                        placeholder="EMAIL"
                        error={errors.email}
                    />
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
                    <SubmitButton buttonText="Sign Up"/>
                </form>
                <small>
                    Already a floppeditor?
                    <Link href="/login">
                        <a className="ml-1 text-blue-500 uppercase">Log In</a>
                    </Link>
                </small>
            </div>
        </div>
    </div>
    )
}