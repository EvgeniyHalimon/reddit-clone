import { isEmpty } from "class-validator"
import { getRepository } from "typeorm"
import path from 'path'
import fs from 'fs'
import Sub from "./subs.entity"
import { subsRepository } from "./subs.repository"
import { postsRepository } from "../posts/posts.repository"
import { CustomError } from "../../shared/CustomError"

const subsService = {
    create: async (queries) => {
        let errors: any = {}
        if (isEmpty(queries.name)) errors.name = 'Name must not be empty'
        if (isEmpty(queries.title)) errors.title = 'Title must not be empty'
    
        const sub = await getRepository(Sub)
          .createQueryBuilder('sub')
          .where('lower(sub.name) = :name', { name: queries.name.toLowerCase() })
          .getOne()
    
        if (sub) errors.name = 'Sub exists already'
        if (Object.keys(errors).length > 0) {
          throw errors
        }
        
        const newSub = new Sub({ 
            name: queries.name, 
            description: queries.description, 
            title: queries.title, 
            user: queries.user 
        })
        await newSub.save()
    
        return newSub
    },
    get: async (name, user) => {
        const sub = await subsRepository.findSubOfFail(name)
        const posts = await postsRepository.findPostInSub(sub)
    
        sub.posts = posts
    
        if (user) {
          sub.posts.forEach((p) => p.setUserVote(user))
        }

        return sub
    },
    search: async (name) => {
        if (isEmpty(name)) {
            throw new CustomError({message : 'Name must not be empty', status: 400 })
        }
        const subs = await getRepository(Sub)
            .createQueryBuilder()
            // react => rea
            .where('LOWER(name) LIKE :name', {
              name: `${name.toLowerCase().trim()}%`,
            })
            .getMany()

        return subs
    },
    ownSub: async (user, name) => {
        const sub = await subsRepository.isOwnSubOfFail(name)

        if (sub.username !== user.username) {
          throw new CustomError({message : 'You dont own this sub', status: 403 })
        }

        return sub
    },
    upload: async (queries) => {
        if (queries.type !== 'image' && queries.type !== 'banner') {
            fs.unlinkSync(queries.path!)
            throw new CustomError({message : 'Invalid type', status: 400 })
        }
      
        let oldImageUrn: string = ''
        if (queries.type === 'image') {
          oldImageUrn = queries.sub.imageUrn ?? ''
          queries.sub.imageUrn! = queries.filename
        } else if (queries.type === 'banner') {
          oldImageUrn = queries.sub.bannerUrn ?? ''
          queries.sub.bannerUrn = queries.filename
        }  
        await queries.sub.save()
      
        if (oldImageUrn !== '') {
          fs.unlinkSync(`public/images/${oldImageUrn}`)
        }

        return queries.sub
    },
}

export default subsService