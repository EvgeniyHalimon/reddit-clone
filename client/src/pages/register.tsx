import { useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Axios from 'axios'
import { useRouter } from 'next/router'
import UniversalInput from '../components/UniversalInput'
import { AuthContext } from '../context/auth'
import AuthBackground from '../components/AuthBackground'
import SubmitButton from '../components/SubmitButton'
import * as yup from 'yup'
import { Field, useFormik, ErrorMessage} from 'formik'
import { post } from '../utils/api'
import { REGISTER } from '../constants/backendConstants'


const validationSchema = yup.object({
    username: yup
    .string()
    .trim()
    .min(2, 'Username should be of mimnimum 2 characters')
    .required('Username is required'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .trim()
    .min(6, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  agreement: yup.bool()
    .oneOf([true], "You must accept the terms and conditions")
  });

//!TODO: refactor form
export default function Register() {
    const router = useRouter()

    const { token } = useContext(AuthContext);

    if(token) router.push("/")
    
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            email: '',
            agreement: false
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const res = await post(REGISTER,{
                username: values.username,
                password: values.password,
                email: values.email,
            })
            if(res.status === 200) router.push("/login")
        },
      });

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
                <form  onSubmit={formik.handleSubmit}>
                    <div className="mb-6">
                        <input type="checkbox" name="agreement" id="agreement" checked={formik.values.agreement} onChange={formik.handleChange}/>
                        <label className='ml-1' htmlFor="agreement" >I agree to the Terms and Conditions</label>
                        {Boolean(formik.touched.agreement) && formik.errors.agreement && (
                        <div className="text-rose-700">{formik.errors.agreement}</div>)}
                    </div>
                    <UniversalInput 
                        className="mb-4" 
                        id="email" 
                        name="email" 
                        placeholder="Email" 
                        type="email" 
                        onChange={formik.handleChange} 
                        value={formik.values.email} 
                        error={Boolean(formik.touched.email)} 
                        helperText={formik.errors.email}                
                    />
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