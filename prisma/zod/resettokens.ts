import * as z from "zod"

export const _resetTokensModel = z.object({
  id: z.number().int(),
  email: z.string(),
  token: z.string(),
  used: z.boolean(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
