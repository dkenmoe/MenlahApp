import { DataSource } from "typeorm";
import { User } from "./entities/userManagement/user";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "kemson",
    database: "Menhlah",
    synchronize: true,
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: [],
})