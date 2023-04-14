import { isEmpty } from "class-validator"
import { getRepository } from "typeorm"
import fs from 'fs'

import Sub from "../../entities/Sub"
import { subsRepository } from "./subs.repository"
import { postsRepository } from "../posts/posts.repository"
import { CustomError } from "../../shared/CustomError"
import { ERROR_NAME, ERROR_SUB, ERROR_TITLE } from "../../shared/constants"

const subsService = {
    create: async (queries) => {
      let errors: any = {}
      if (isEmpty(queries.name)) errors.name = ERROR_NAME
      if (isEmpty(queries.title)) errors.title = ERROR_TITLE
  
      const sub = await getRepository(Sub)
        .createQueryBuilder('sub')
        .where('lower(sub.name) = :name', { name: queries.name.toLowerCase() })
        .getOne()
  
      if (sub) errors.name = ERROR_SUB
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
        if(sub === null || undefined) throw new CustomError({ message: 'Sub not found', status: 404 })
        const posts = await postsRepository.findPostInSub(sub)
        if(posts === null || undefined) throw new CustomError({ message: 'Posts not found', status: 404 })
    
        sub.posts = posts
    
        if (user) {
          sub.posts.forEach((p) => p.setUserVote(user))
        }

        return sub
    },
    search: async (name) => {
        if (isEmpty(name)) {
          throw new CustomError({message : ERROR_NAME, status: 400 })
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
          throw new CustomError({message: 'Invalid type', status: 400 })
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