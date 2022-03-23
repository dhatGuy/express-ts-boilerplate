import * as express from "express";
import jwt from "jsonwebtoken";
import HttpException from "../common/http-exception";
import { DataStoredInToken } from "../interfaces/dataStoredInToken";
import prisma from "../lib/prisma";

export const expressAuthentication = async (
  req: express.Request,
  securityName: string,
  _scopes?: string[]
) => {
  if (securityName === "jwt") {
    const token = req.header("auth-token");
    if (!token) {
      throw new HttpException(401, "Token missing");
    }

    try {
      const verified = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as DataStoredInToken;

      const data = await prisma.user.findUnique({
        where: {
          id: verified.id,
        },
      });

      if (!data) {
        throw new HttpException(401, "Invalid token");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...user } = data;
      return user;
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      throw new HttpException(401, message || "Invalid Token");
    }
  }
};
