import { isEmpty, validate } from "class-validator"
import bcrypt from 'bcrypt'
import User from "../users/users.entity"
import { userRepository } from "./auth.repository"
import { CustomError } from "../../shared/CustomError"

const mapErrors = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
      prev[err.property] = Object.entries(err.constraints)[0][1]
      return prev
    }, {})
}

const authService = {
    register: async ( email, username, password ) => {
        // Validate data
        let errors: any = {}
        const emailUser = await userRepository.findEmail(email)
        const usernameUser = await userRepository.findUsername(username)
    
        if (emailUser) errors.email = 'Email is already taken'
        if (usernameUser) errors.username = 'Username is already taken'
    
        if (Object.keys(errors).length > 0) {
          return errors
        }
        // Create the user
        const user = new User({ email, username, password })
    
        errors = await validate(user)
        if (errors.length > 0) {
          return mapErrors(errors)
        }
    
        await user.save()
        // Return the user
        return user
    },
    login: async (username, password) => {
        let errors: any = {}

        if (isEmpty(username)) errors.username = 'Username must not be empty'
        if (isEmpty(password)) errors.password = 'Password must not be empty'
        if (Object.keys(errors).length > 0) {
          return errors
        }
    
        const user = await userRepository.findUsername(username)
    
        if (!user) throw new CustomError({ message: 'User not found', status: 404 });
    
        const passwordMatches = await bcrypt.compare(password, user.password)
    
        if (!passwordMatches) throw new CustomError({ message: 'Password is incorrect', status: 401 });

        return user
    }
}

export default authService