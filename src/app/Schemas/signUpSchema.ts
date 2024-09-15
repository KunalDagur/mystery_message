import { z } from "zod";

export const usernameValidation =
    z.string()
        .min(5, "Username must be at least 5 characters long")
        .max(20, "Username can not be more than 20 characters long")
        .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(16, { message: "Password can not be more than 16 characters long" }),
})