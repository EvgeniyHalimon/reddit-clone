import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from "../../entities/User"
import { userRepository } from "./auth.repository"
import { CustomError } from "../../shared/CustomError"
import { ERROR_EMAIL, ERROR_USERNAME } from "../../shared/constants"
import jwt, { Secret } from 'jsonwebtoken';
import { IAuthLogin, IAuthRegister, ITokens } from './types'

dotenv.config();

const ACCESS_KEY: Secret = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_KEY: Secret = process.env.REFRESH_TOKEN_SECRET;

const generateTokens = (foundUser: any): ITokens => {
  console.log("🚀 ~ file: auth.service.ts:16 ~ generateTokens ~ foundUser:", foundUser)
  const accessToken = jwt.sign(
    {
      user: foundUser,
    },
    ACCESS_KEY,
    { expiresIn: '1h' },
  );
  console.log("🚀 ~ file: auth.service.ts:23 ~ generateTokens ~ accessToken:", accessToken)
  const refreshToken = jwt.sign(
    {
      user: foundUser,
    },
    REFRESH_KEY,
    { expiresIn: '1d' },
  );
  return { accessToken, refreshToken };
};

const authService = {
  register: async (body: IAuthRegister) => {
    // Validate data
    const emailUser = await userRepository.findEmail(body.email)
    const usernameUser = await userRepository.findUsername(body.username)

    if (emailUser) throw new CustomError({message: ERROR_EMAIL, status: 400})
    if (usernameUser) throw new CustomError({message: ERROR_USERNAME, status: 400})
    // Create the user
    const user = new User({ email: body.email, username: body.username, password: body.password })

    await user.save()
    // Return the user
    return user
  },
  login: async (body: IAuthLogin): Promise<ITokens | undefined>  => {
    const user = await userRepository.findUsername(body.username)
    if (user === undefined) {
      throw new CustomError({ message: 'User not found', status: 404 });
    }
    const passwordMatches = await bcrypt.compare(body.password, user.password)

    if (!passwordMatches) {
      throw new CustomError({ message: 'Password is invalid', status: 400 });
    }
    return generateTokens(user);
  },
  refreshToken: async (username: string): Promise<ITokens | undefined> => {
    const foundUser = await userRepository.findUsername(username)
    // evaluate jwt 
    if(foundUser){
      return generateTokens(foundUser);
    }
  },
}

export default authService