import express from "express";
import { User } from "../entities/userManagement/user";
import bcrypt from "bcrypt";
import _ from "lodash";
import { validate } from "class-validator";
import passwordComplexity from "joi-password-complexity";
import jwt from "jsonwebtoken";
import config from "config";
import { auth } from "../middleware/auth";


const router = express.Router();
const complexityOptions = {
    min: 10,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
};

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

    // const validatPwdComplexity = passwordComplexity(complexityOptions).validate("aPassword123!");

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
        .send(_.pick(user, ["id", "firstName", "lastName", "email", "role", "createAt", "updateAt"]));
});

export {
    router as createUserRoute
}
