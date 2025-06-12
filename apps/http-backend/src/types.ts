import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(3).max(30),
    username: z.string().email(),
    password: z.string().min(8).max(20)
})

export const LoginSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8).max(20)
})


export const RoomSchema = z.object({
    slug: z.string().min(3).max(30)
})