import { Role } from "./role";
import jwt from "jsonwebtoken";
import config from "config";
import {
    Entity, Column, PrimaryGeneratedColumn, BaseEntity,
    CreateDateColumn, UpdateDateColumn
} from "typeorm";
import {
    Length,
    IsEmail
} from "class-validator"
import _ from "lodash";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: number;

    @Column()
    @Length(3, 1024)
    password!: string

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({
        unique: true
    })
    @IsEmail()
    email!: string;

    @Column({
        default: "student"
    })
    role!: Role;

    @Column({
        nullable: true
    })
    picture!: string;

    @CreateDateColumn()
    createAt!: Date;

    @UpdateDateColumn()
    updateAt!: Date;

    public generateAuthToken():any{
        return jwt.sign({ id: this.id, role: this.role, email: this.email }, config.get("jwtPrivateKey"));
    }

    public getUserInfos():any{
        return _.pick(this, ["id", "firstName", "lastName", "email", "role", "createAt", "updateAt", "picture"])
    }
}