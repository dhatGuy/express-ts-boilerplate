import { z } from "zod";
import { _UserModel } from "../../prisma/zod";

export const userCreateSchema = _UserModel
  .pick({
    name: true,
    email: true,
  })
  .extend({
    password: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(5, "Password must be at least 5 characters long"),
  });

export const userUpdateSchema = _UserModel.pick({
  id: true,
  name: true,
  email: true,
});

export const userDeleteSchema = _UserModel.pick({
  id: true,
});
