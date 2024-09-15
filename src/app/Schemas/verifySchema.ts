import { z } from "zod";

export const verifySchema = z.object({
    identifier: z.string()
        .min(6, { message: "Code must be of 6 digits" })
})