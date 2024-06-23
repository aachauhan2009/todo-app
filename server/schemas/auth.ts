import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});
