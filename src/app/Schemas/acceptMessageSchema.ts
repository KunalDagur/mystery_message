import { z } from "zod";

export const acceptMessage = z.object({
    message: z.boolean()
})