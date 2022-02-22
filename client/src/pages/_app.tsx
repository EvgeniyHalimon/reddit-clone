import '../styles/Tailwind.css'
import  { AppProps } from 'next/app'
import Axios from 'axios'
import Navbar from "../components/Navbar"
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/auth'
import "../styles/icons.css"

Axios.defaults.baseURL = 'http://localhost:5000/api'
Axios.defaults.withCredentials = true

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const authroutes = ["/register" ,"/login"]
  const authRoute = authroutes.includes(pathname)
  return( 
    <AuthProvider>
      {!authRoute && <Navbar/>}
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default App
