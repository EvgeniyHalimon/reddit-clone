import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express'
import morgan from "morgan";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config()

import authRoutes from './routes/auth'

import trim from "./middleware/trim"

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)
app.use(cookieParser())

app.get('/', (req, res) => res.send("Floppa send their regards"))
app.use("/api/auth", authRoutes)


app.listen(process.env.PORT, async () => {
    console.log("Server running on port 5000");
    try{    
        await createConnection()
        console.log('db connected');
    } catch (err) {
        console.log(err);
    }
})