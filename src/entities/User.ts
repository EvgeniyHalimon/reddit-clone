import { IsEmail, Length } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, BeforeInsert, UpdateDateColumn} from "typeorm";
import bcrypt from "bcrypt"
import { classToPlain , Exclude, instanceToPlain} from "class-transformer";

@Entity('Users') // внутри скобок - имя таблицы
export class User extends BaseEntity{
    constructor(user: Partial<User>){
        super()
        Object.assign(this, user)
    }

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

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

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 6)
    }

    toJSON(){
        return instanceToPlain(this)
    }
}