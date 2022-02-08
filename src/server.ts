import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express'
import morgan from "morgan";

import authRoutes from './routes/auth'

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.send("Floppa send their regards"))
app.use("/api/auth", authRoutes)


app.listen(5000, async () => {
    console.log("Server running on port 5000");
    try{    
        await createConnection()
        console.log('db connected');
    } catch (err) {
        console.log(err);
    }
})