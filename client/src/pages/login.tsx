import Axios from "axios"
import Link from "next/link"
import Head from "next/head"
import { useRouter } from "next/router"
import UniversalInput from "../components/UniversalInput"
import { useAuthDispatch, useAuthState } from "../context/auth"
import AuthBackground from "../components/AuthBackground"
import SubmitButton from "../components/SubmitButton"
import * as yup from 'yup';
import { useFormik } from "formik"

const validationSchema = yup.object({
    username: yup
      .string()
      .trim()
      .required('You forgot to enter your username'),
    password: yup
      .string()
      .trim()
      .required('You forgot to enter your password'),
  });

//!TODO: refactor form
const Login = () => {

    const dispatch = useAuthDispatch()
    const {authenticated} = useAuthState()
    
    const router = useRouter()
    if(authenticated) router.push("/")

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const res = await Axios.post('/auth/login',{
                username: values.username,
                password: values.password,
            })
            dispatch('LOGIN',res.data)
            if(res.status === 200) router.push("/")
        },
      });

return (
    <div className="flex bg-white">
        <Head>
            <title>Login</title>
        </Head>
        <AuthBackground/>
        <div className="flex flex-col justify-center pl-6">
            <div className="w-70">
                <h1 className="mb-2 text-lg font-medium">Log in</h1>
                <form onSubmit={formik.handleSubmit}>
                    <UniversalInput 
                        className="mb-4" 
                        id="username" 
                        name="username" 
                        placeholder="Username" 
                        type="text" 
                        onChange={formik.handleChange} 
                        value={formik.values.username} 
                        error={Boolean(formik.touched.username)} 
                        helperText={formik.errors.username}                
                    />
                    <UniversalInput 
                        className="mb-4" 
                        id="password" 
                        name="password" 
                        placeholder="Password" 
                        type="password" 
                        onChange={formik.handleChange} 
                        value={formik.values.password} 
                        error={Boolean(formik.touched.password)} 
                        helperText={formik.errors.password}                
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