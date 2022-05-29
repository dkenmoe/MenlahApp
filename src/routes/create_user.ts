import express from "express";
import { User } from "../entities/userManagement/user";
import bcrypt from "bcrypt";
import _ from "lodash";
import { validate } from "class-validator";
import passwordComplexity from "joi-password-complexity";
import jwt from "jsonwebtoken";
import config from "config";
import { auth } from "../middleware/auth";
import { Role } from "../entities/userManagement/role";

const router = express.Router();
const complexityOptions = {
    min: 5,
    max: 15,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
};

router.get("/api/user/me", auth, async (req, res) => {
    const user = (req as any).user;
    const currentUser = await User.findOneBy({
        id: user.id,
    });

    if (!currentUser) {
        return res.status(400).send("There is no user with given id");
    }

    return res.status(200).send(currentUser.getUserInfos());
});

router.get("/api/users", auth, async (req, res) => {
    const user = (req as any).user;
    const role: Role = <Role>(user as any).role;
    if (role === Role.Admin) {
        const allUsers = await User.find();
        return res.status(200).send(allUsers.map(data => data.getUserInfos()));
    }

    return res.status(403).send("You don't have a permission to get all users");
});

router.post("/api/user", auth, async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;

    //const user = User.create(_.pick(req.body, ['password', 'firstName', 'lastName', 'email']));
    const user = User.create({
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email
    })

    const errors = await validate(user)
    if (errors.length > 0) {
        return res.status(400).send(errors);
    }

    //TODO: Activate strong password
    //const validatPwdComplexity = passwordComplexity(complexityOptions).validate("aPassword123!");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    try {
        await user.save();
    }
    catch (ex: any) {
        return res.status(400).send(ex.message);
    }
    //const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, config.get("jwtPrivateKey"));
    return res.header('x-auth-token', user.generateAuthToken())
        .status(200)
        .send(user.getUserInfos());
});

export {
    router as createUserRoute
}
