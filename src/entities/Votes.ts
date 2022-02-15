import {
    Entity as TOEntity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm'

import Entity from './Enitity'
import User from './User'
import Post from './Post'
import Comment from './Comment'

@TOEntity('votes')
export default class Vote extends Entity {
    constructor(sub: Partial<Vote>) {
    super()
    Object.assign(this, sub)
    }

    @Column()
    value: string

    @ManyToOne(() => User)
    @JoinColumn({name: 'username', referencedColumnName: 'username'})
    user: User

    @Column()
    username: string
    
    @ManyToOne(() => Post)
    post: Post

    @ManyToOne(() => Comment)
    comment: Comment
}