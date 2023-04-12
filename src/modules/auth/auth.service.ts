import bcrypt from 'bcrypt'
import User from "../../entities/User"
import { userRepository } from "./auth.repository"
import { CustomError } from "../../shared/CustomError"
import { ERROR_EMAIL, ERROR_USERNAME } from "../../shared/constants"

const authService = {
  register: async ( email, username, password ) => {
    // Validate data
    const emailUser = await userRepository.findEmail(email)
    const usernameUser = await userRepository.findUsername(username)

    if (emailUser) throw new CustomError({message: ERROR_EMAIL, status: 400})
    if (usernameUser) throw new CustomError({message: ERROR_USERNAME, status: 400})

    // Create the user
    const user = new User({ email, username, password })

    await user.save()
    // Return the user
    return user
  },
  login: async (username, password) => {
    const user = await userRepository.findUsername(username)

    if (!user) throw new CustomError({ message: 'User not found', status: 404 });

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) throw new CustomError({ message: 'Password is incorrect', status: 401 });
    return user
  }
}

export default authService