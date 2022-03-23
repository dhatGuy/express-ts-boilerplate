import argon2 from "argon2";
import * as crypto from "crypto";
import { addHours } from "date-fns";
import jwt from "jsonwebtoken";
import HttpException from "../common/http-exception";
import { DataStoredInToken } from "../interfaces/dataStoredInToken";
import prisma from "../lib/prisma";
import mailService from "../services/mail.service";
import userService from "../user/user.service";
import logger from "../utils/logger";
import {
  IAuthPayload,
  IResetPasswordInput,
  ISignInInput,
  ISignUpInput,
  IVerifyPasswordResetToken,
} from "./auth.interface";

class AuthService {
  signup = async (input: ISignUpInput): Promise<IAuthPayload> => {
    const { email } = input;

    const emailTaken = await userService.getByEmail(email);

    if (emailTaken) throw new HttpException(400, "Email already exists");

    const user = await userService.create(input);

    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
    };

    const token = jwt.sign(
      dataStoredInToken,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    await mailService.verificationMail(email, token, user);

    return { success: true, accessToken: token, user };
  };

  signin = async (input: ISignInInput): Promise<IAuthPayload> => {
    const { email, password } = input;

    if (!email || !password)
      throw new HttpException(400, "Invalid credentials");

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new HttpException(400, "User not found");

    const { passwordHash, ...userData } = user;

    if (await argon2.verify(passwordHash, password)) {
      const dataStoredInToken: DataStoredInToken = {
        id: userData.id,
      };
      const accessToken = jwt.sign(
        dataStoredInToken,
        process.env.ACCESS_TOKEN_SECRET as string
      );

      return { success: true, accessToken, user: userData };
    } else throw new HttpException(400, "Invalid Password");
  };

  forgotPassword = async (email: string) => {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new HttpException(400, "User not found");

    await prisma.resetTokens.updateMany({
      where: {
        email,
      },
      data: {
        used: true,
      },
    });

    const fpSalt = crypto.randomBytes(64).toString("base64");
    logger.info(fpSalt);

    await prisma.resetTokens.create({
      data: {
        token: fpSalt,
        email,
        expiresAt: addHours(new Date(), 2),
      },
    });

    await mailService.forgotPasswordMail(fpSalt, email);

    return { success: true };
  };

  verifyResetToken = async (body: IVerifyPasswordResetToken) => {
    const { token, email } = body;
    await prisma.resetTokens.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    const record = await prisma.resetTokens.findFirst({
      where: {
        email,
        token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    logger.info(record);

    if (!record) throw new HttpException(400, "Token is invalid or expired");

    return { success: true };
  };

  resetPassword = async (body: IResetPasswordInput) => {
    const { email, password, password2, token } = body;
    if (password !== password2)
      throw new HttpException(400, "Passwords do not match");

    const record = await prisma.resetTokens.findFirst({
      where: {
        email,
        token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!record) throw new HttpException(400, "Token is invalid or expired");

    await prisma.resetTokens.updateMany({
      where: {
        email,
      },
      data: {
        used: true,
      },
    });

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordHash: await argon2.hash(password),
      },
    });

    return { success: true };
  };

  requestVerificationMail = async (email: string) => {
    if (!email) throw new HttpException(400, "Email is required");
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new HttpException(400, "User not found");

    await prisma.verificationTokens.updateMany({
      where: {
        email,
      },
      data: {
        used: true,
      },
    });

    const vtSalt = crypto.randomBytes(64).toString("base64");

    await prisma.verificationTokens.create({
      data: {
        token: vtSalt,
        email,
      },
    });

    await mailService.verificationMail(email, vtSalt, user);

    return { success: true };
  };

  confirmEmail = async (body: IVerifyPasswordResetToken) => {
    const { token, email } = body;
    const record = await prisma.verificationTokens.findFirst({
      where: {
        email,
        token,
        used: false,
      },
    });

    logger.info(record);

    if (!record) throw new HttpException(400, "Token is invalid or expired");

    await prisma.verificationTokens.updateMany({
      where: {
        email,
      },
      data: {
        used: true,
      },
    });

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        verified: true,
      },
    });

    return { success: true };
  };
}

export default new AuthService();
