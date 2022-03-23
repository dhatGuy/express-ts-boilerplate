import { User } from "@prisma/client";
import * as argon2 from "argon2";
import HttpException from "../common/http-exception";
import { HttpStatus } from "../interfaces/httpStatus";
import prisma from "../lib/prisma";
import logger from "../utils/logger";
import { ICreateUserInput, IUpdateUserInput } from "./user.interface";

class userService {
  /**
   * create
   */
  public async create(input: ICreateUserInput): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (user) {
      throw new HttpException(HttpStatus.BAD_REQUEST, "User already exists");
    }

    const passwordHash = await argon2.hash(input.password);

    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
      },
    });
  }

  /**
   * getAll
   */
  public async getAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  /**
   * getById
   */
  public async getById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, "User not found");
    }

    return user;
  }

  /**
   * getByEmail
   */
  public async getByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, "User not found");
    }

    return user;
  }

  /**
   * delete
   */
  public async delete(id: string): Promise<User> {
    await this.getById(id);

    return await prisma.user.delete({
      where: { id },
    });
  }

  public async updateUser(id: string, data: IUpdateUserInput): Promise<User> {
    const user = await this.getById(id);

    const emailChanged =
      data.email?.trim() &&
      data.email.trim().toLowerCase() !== user.email.toLowerCase();

    if (emailChanged && (await this.getByEmail(data.email))) {
      throw new HttpException(400, "Email already exists");
    }

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          email: data.email.trim() || user.email,
          name: data.name || user.name,
        },
      });

      return updatedUser;
    } catch (error) {
      logger.error(error);
      throw new HttpException(404, "Could not update user");
    }
  }
}

export default new userService();
