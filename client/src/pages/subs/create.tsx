/* eslint-disable react-hooks/rules-of-hooks */
import Axios from "axios"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { useState } from "react"

export default function create() {
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState<Partial<any>>({})
    return (
        <div className="flex bg-white">
            <Head>
                <title>Create a Community</title>
            </Head>
            <div
                className="h-screen bg- top bg-cover w-36"
                style={{ backgroundImage: "url('/images/floppa.png')" }}
            ></div>
            <div className="flex flex-col justify-center pl-6">
                <h1 className="mb-2 text-lg font-medium">
                    Create a community
                    <hr />
                    <form>
                        <div className="my-6">
                            <p className="font-medium">Name</p>
                            <div className="text-xs text-gray-500">
                                Community names including capitalization cannot be changed
                            </div>
                            <input type="text" className="border border-gray-200 w-full rounded p-3" />
                        </div>
                    </form>
                </h1>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    try {
      const cookie = req.headers.cookie
      if(!cookie) throw new Error("Missing auth token cookie")
      await Axios.get('/auth/me', {headers: {cookie}})
      return { props: {}}
    } catch (err) {
      res.writeHead(307, {Location: "/login"}).end()
    }
  }