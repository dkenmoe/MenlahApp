import { info } from "console";
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course";
import { News } from "./news";

@Entity()
export class CourseInfo extends News {    

    @ManyToMany(() => Course, course => course.infos)
    courseInfos!: Course[];   
}