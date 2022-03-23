import { User } from "@prisma/client";
import * as express from "express";
import {
  Body,
  Delete,
  Get,
  Path,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import HttpException from "../common/http-exception";
import { HttpStatus } from "../interfaces/httpStatus";
import { IUpdateUserInput } from "./user.interface";
import userService from "./user.service";

@Route("/users")
@Tags("User")
@Security("jwt")
export class UserController {
  @Get("/")
  async getAll(): Promise<User[]> {
    // protect this route with admin role
    return await userService.getAll();
  }

  @Get("/:id")
  async getUserById(
    @Path() id: string,
    @Request() req: express.Request
  ): Promise<User | null> {
    if (id === req.user.id) {
      return await userService.getById(id);
    }
    throw new HttpException(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  @Put("/:id")
  // @Middlewares(validate(userUpdateSchema))
  async updateUser(
    @Path() id: string,
    @Body() input: IUpdateUserInput,
    @Request() req: express.Request
  ): Promise<User> {
    if (id === req.user.id) {
      const user = await userService.update(id, input);
      return user;
    }
    throw new HttpException(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  @Delete("/:id")
  async deleteUser(
    @Path() id: string,
    @Request() req: express.Request
  ): Promise<User | null> {
    if (id === req.user.id) {
      return await userService.delete(id);
    }
    throw new HttpException(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }
}

export default new UserController();
