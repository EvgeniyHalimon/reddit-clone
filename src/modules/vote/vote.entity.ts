import { Entity as TOEntity, Column, ManyToOne, JoinColumn } from 'typeorm'

import Entity from '../Base-entity/Entity'
import Post from '../posts/posts.entity'
import User from '../users/users.entity'
import Comment from '../comment/comment.entity'

@TOEntity('votes')
export default class Vote extends Entity {
  constructor(vote: Partial<Vote>) {
    super()
    Object.assign(this, vote)
  }

  @Column()
  value: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @Column()
  username: string

  @ManyToOne(() => Post)
  post: Post

  @ManyToOne(() => Comment)
  comment: Comment
}