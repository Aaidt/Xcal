import express, { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-common/config"
import jwt from "jsonwebtoken";

export async function Middleware(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers["authorization"];
    const token = typeof authHeader === "string" ? authHeader : ""

    if(!JWT_SECRET){
        console.log('No JWT_SECRET provided.')
        return
    }
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload

    if(decoded){
        req.userId = decoded.userId
        next()
    }else{
        res.status(403).json({ message: "Incorrect token provided." })
    }
}