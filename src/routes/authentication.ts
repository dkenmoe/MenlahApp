import express from "express";
import { User } from "../entities/userManagement/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

const router = express.Router();

router.post("/api/auth",async (req, res) => {
    const {
        email,
        password
    } = req.body;   
    const user = await User.findOneBy({
        email: email,
    })   

    if(!user){
        return res.status(400).send("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        return res.status(400).send("Invalid email or password");
    }

    //const token = jwt.sign({ id: user.id, role: user.role, email:user.email }, config.get("jwtPrivateKey"));
    return res.status(200).send(user.generateAuthToken());

    // await user.save();
    // return res.send(user);
});

export {
    router as authenticationRoute
}

