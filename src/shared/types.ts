import { Request } from "express"
import User from "../entities/User"
import Sub from "../entities/Sub"

export interface CustomRequest extends Request{
    user: User,
    sub: Sub
  }

  export interface IDecoded{
    user: User,
    sub: Sub,
    iat: number,
    exp: number
  }