import * as z from "zod"

export const _verificationTokensModel = z.object({
  id: z.number().int(),
  email: z.string(),
  token: z.string(),
  used: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
