import {
    Entity, Column, PrimaryGeneratedColumn, BaseEntity,
    CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable
} from "typeorm";
import { CourseInfo } from "./courseInfo";
import { Student } from "./student";
import { Teacher } from "./teacher";
import { User } from "./user";

export class Course {

    @PrimaryGeneratedColumn("uuid")
    id!: number;

    @Column()
    title!:string;

    @Column()
    description!:string;

    @ManyToMany(() => Teacher, teacher => teacher.courses)
    teachers!:Teacher[];

    @ManyToMany(() => Student, student => student.courses)
    students!:Student[];

    @ManyToMany(() => CourseInfo, info => info.courseInfos, { onUpdate: "CASCADE" })
    @JoinTable()
    infos!: CourseInfo[];
}