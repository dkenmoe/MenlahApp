import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Course } from "./course";
import { Role } from "./role";
import { User } from "./user";

@Entity()
export class Teacher extends User {
    @ManyToMany(() => Course, course => course.students, { onUpdate: "CASCADE" })
    @JoinTable()
    courses!: Course[];

    @Column({
        default: "teacher"
    })
    role!: Role;
}