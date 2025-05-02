import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(3, "Username must be atleast 3 character")
    .max(12, "Username atmost 12 character")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")


export const signupValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be 6 character"})
})