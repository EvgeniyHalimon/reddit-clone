import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn} from "typeorm";

@Entity('Users') // внутри скобок - имя таблицы
export class User extends BaseEntity{
    constructor(user: Partial<User>){
        super()
        Object.assign(this, user)
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({unique: true})
    email: string;

    @Index()
    @Column({unique: true})
    username: string;

    @Column()
    password: number;

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date
}
