import { NextFunction, Request, Response, Router } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'

import auth from '../../shared/middleware/auth'
import user from '../../shared/middleware/user'
import { makeId } from '../../shared/utils/helpers'
import subsService from './subs.service'

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body

  const queries = {
    name: name,
    title: title,
    description: description,
    user: res.locals.user
  }

  try {
    const sub = await subsService.create(queries)
    return res.json(sub)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const getSub = async (req: Request, res: Response) => {
  try {
    const sub = await subsService.get(req.params.name, res.locals.user)
    return res.json(sub)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ sub: 'Sub not found' })
  }
}

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await subsService.ownSub(res.locals.user, req.params.name)
    res.locals.sub = sub
    return next()
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' })
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
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      callback(null, true)
    } else {
      callback(new Error('Not an image'))
    }
  },
})

const uploadSubImage = async (req: Request, res: Response) => {
  const queries = {
    sub: res.locals.sub,
    type: req.body.type,
    path: req?.file?.path!,
    filename: req.file!.filename
  }
  try{
    const sub = await subsService.upload(queries)
    return res.json(sub)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const searchSubs = async (req: Request, res: Response) => {
  try {
    const subs = await subsService.search(req.params.name)
    return res.json(subs)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const router = Router()

router.post('/', user, auth, createSub)
router.get('/:name', user, getSub)
router.get('/search/:name', searchSubs)
router.post(
  '/:name/image',
  user,
  auth,
  ownSub,
  upload.single('file'),
  uploadSubImage
)

export default router