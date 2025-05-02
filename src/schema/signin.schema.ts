import {z} from 'zod';

export const signinValidation = z.object({
    identifier: z.string().email({message: "Invalid Email address"}),
    password: z.string().min(6, "Password must be 6 character"),
})