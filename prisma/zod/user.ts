import * as z from "zod"

export const _UserModel = z.object({
  id: z.string().uuid({ message: "Invalid UUID" }),
  name: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  passwordHash: z.string(),
  verified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
