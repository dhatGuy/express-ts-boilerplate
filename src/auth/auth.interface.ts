import { User } from "@prisma/client";

export interface IAuthPayload {
  success: boolean;
  accessToken: string | null;
  user: Pick<User, "email" | "id"> | null;
}

export interface ISignUpInput {
  email: string;
  password: string;
  name: string;
}

export interface ISignInInput {
  email: string;
  password: string;
}

export interface IResetPasswordInput {
  email: string;
  password: string;
  password2: string;
  token: string;
}

export interface IVerifyPasswordResetToken {
  token: string;
  email: string;
}
