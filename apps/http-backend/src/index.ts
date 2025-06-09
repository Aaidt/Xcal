import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { prismaClient } from "@repo/db/client"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router();

