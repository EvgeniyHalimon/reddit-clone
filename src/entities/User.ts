import { IsEmail, Length } from "class-validator";
import {Entity as TOEntity, Column, Index, BeforeInsert, OneToMany} from "typeorm";
import bcrypt from "bcrypt"
import { Exclude } from "class-transformer";

import Entity from  "./Enitity"
import Post from "./Post";

@TOEntity('Users') // внутри скобок - имя таблицы
export default class User extends Entity{
    constructor(user: Partial<User>){
        super()
        Object.assign(this, user)
    }

    @Index()
    @IsEmail()
    @Column({unique: true})
    email: string;

    @Index()
    @Length(2, 255, {message : " Username must be at least 2 characters long"})
    @Column({unique: true})
    username: string;


    @Exclude()
    @Column()
    @Length(6, 255) // min-max value
    password: string;

    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 6)
    }
}