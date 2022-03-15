import { Request, Response, Router } from "express";
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs'
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import User from "../entities/User";
import user from "../middleware/user";
import { makeId } from "../utils/helpers";
import auth from "../middleware/auth";

const getUserSubmissions = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneOrFail({
            where: {username: req.params.username},
            select: ['username', 'createdAt', 'userAvatar']
        })

        const posts = await Post.find({
            where: {user},
            relations: ['comments', 'votes', 'sub'],
        })

        const comments = await Comment.find({
            where: {user},
            relations: ['post'],
        })

        if(res.locals.user){
            posts.forEach(post => post.setUserVote(res.locals.user))
            comments.forEach(comment => comment.setUserVote(res.locals.user))
        }

        let submissions: any[] = []
        posts.forEach(post => submissions.push({type: 'Post', ...post.toJSON()}))
        comments.forEach(comment => submissions.push({type: 'Comment', ...comment.toJSON()}))
        submissions.sort((a,b) => {
            if(b.createdAt > a.createdAt) return 1
            if(b.createdAt < a.createdAt) return -1
            return 0
        })
        return res.json({user, submissions})
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

const upload = multer({
    storage: multer.diskStorage({
      destination: 'public/images',
      filename: (_, file, callback) => {
        const name = makeId(15)
        callback(null, name + path.extname(file.originalname)) // e.g. jh34gh2v4y + .png
      },
    }),
    fileFilter: (_, file: any, callback: FileFilterCallback) => {
      if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        callback(null, true)
      } else {
        callback(new Error('Not an image'))
      }
    },
})

const uploadUserImage = async (req: Request, res: Response) => {
    const user: User = res.locals.user
    try {
      const type = req.body.type
      console.log(req.file)
  
      if (type !== 'image') {
        fs.unlinkSync(req.file.path)
        return res.status(400).json({ error: 'Invalid type' })
      }
  
      let oldImageUrn: string = ''
      if (type === 'image') {
        oldImageUrn = user.userAvatar ?? ''
        user.userAvatar = req.file.filename
      } 
      await user.save()
  
      if (oldImageUrn !== '') {
        fs.unlinkSync(`public\\images\\${oldImageUrn}`)
      }
  
      return res.json(user)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

const router = Router()

router.get('/:username', user, getUserSubmissions)
router.post(
    '/:username/image',
    user,
    auth,
    upload.single('file'),
    uploadUserImage
)

export default router