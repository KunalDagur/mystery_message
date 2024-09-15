import { z } from "zod"

export const messageSchema = z.object({
    content: z.string()
        .min(20, { message: "At least 20 characters required" })
})