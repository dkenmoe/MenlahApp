import { Permission } from "./permissions";

export class Role{
    public id!:number;
    public name!:string;
    public permissions!:Permission[];
}