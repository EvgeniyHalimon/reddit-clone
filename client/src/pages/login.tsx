import Link from "next/link"
import Head from "next/head"
import { useRouter } from "next/router"
import UniversalInput from "../components/UniversalInput"
import AuthBackground from "../components/AuthBackground"
import SubmitButton from "../components/SubmitButton"
import * as yup from 'yup';
import { useFormik } from "formik"
import useAxios from "../hooks/useAxios"
import { useContext } from "react"
import { AuthContext } from "../context/auth"
import { getAccessToken, saveTokens } from "../utils/tokensWorkshop"
import { LOGIN } from '../constants/backendConstants'
import { post } from "../utils/api"

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

    const { token, setToken } = useContext(AuthContext);
    
    const router = useRouter()
    if(token) router.push("/")

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const res = await post(LOGIN,{
                username: values.username,
                password: values.password,
            })
            if(!res.data.error){
                saveTokens(res.data);
                setToken(getAccessToken());
                router.push("/")
            }
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