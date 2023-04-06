import { useRouter } from 'next/router'
import React from 'react'

const AuthBackground = () => {
  const router = useRouter()
  return (
    <div
        className={`h-screen ${router.pathname === '/login' ? 'bg-right-bottom' : 'bg-left-bottom'} bg-cover w-36`}
        style={{ backgroundImage: "url('/images/floppa.png')" }}
    />
  )
}

export default AuthBackground