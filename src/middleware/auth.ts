import express from 'express';
import jwt from "jsonwebtoken";
import config from "config";

export function auth(req: express.Request, res: express.Response, next: any) {

    const token = req.header("x-auth-token") as string;
    if (!token) {
       return res.status(401).send("Acess denied. No token provided");
    }

    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        (req as any).user = decoded;
        next();
    }
    catch (ex) {
        return res.status(400).send("Invalid token");
    }
}