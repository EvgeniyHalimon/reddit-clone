import { NextFunction, Request, Response, Router } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'

import { makeId } from '../../shared/utils/helpers'
import subsService from './subs.service'
import { CustomRequest } from '../../shared/types'

const createSub = async (req: CustomRequest, res: Response) => {
  const { name, title, description } = req.body

  const queries = {
    name: name,
    title: title,
    description: description,
    user: req.user
  }

  try {
    const sub = await subsService.create(queries)
    return res.json(sub)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const getSub = async (req: CustomRequest, res: Response) => {
  try {
    const sub = await subsService.get(req.params.name, req.user)
    return res.json(sub)
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({ error: err.message })
  }
}

const ownSub = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const sub = await subsService.ownSub(req.user, req.params.name)
    req.sub = sub
    return next()
  } catch (err) {
    return res.status(err.status).json({ error: err.message })
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

router.post('/', createSub)
router.get('/:name', getSub)
router.get('/search/:name', searchSubs)
router.post(
  '/:name/image',
  ownSub,
  upload.single('file'),
  uploadSubImage
)

export default router