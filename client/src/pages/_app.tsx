import '../styles/Tailwind.css'
import  { AppProps } from 'next/app'
import Axios from 'axios'
import Navbar from "../components/Navbar"
import { Fragment } from 'react'
import { useRouter } from 'next/router';

Axios.defaults.baseURL = 'http://localhost:5000/api'
Axios.defaults.withCredentials = true

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const authroutes = ["/register" ,"/login"]
  const authRoute = authroutes.includes(pathname)
  return( 
    <Fragment>
      {!authRoute && <Navbar/>}
      <Component {...pageProps} />
    </Fragment>
  )
}

export default App
