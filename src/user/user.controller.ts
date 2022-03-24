import { User } from "@prisma/client";
import * as express from "express";
import {
  Body,
  Delete,
  Get,
  Middlewares,
  Path,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import HttpException from "../common/http-exception";
import { HttpStatus } from "../interfaces/httpStatus";
import { validate } from "../middleware/validation.middleware";
import { IUpdateUserInput } from "./user.interface";
import userService from "./user.service";
import { userUpdateSchema } from "./user.validation";

@Route("/users")
@Tags("User")
@Security("jwt")
export class UserController {
  /**
   * Get all users
   */
  @Get("/")
  async getAll(): Promise<User[]> {
    // protect this route with admin role
    return await userService.getAll();
  }

  /**
   * Retrieve a user by id. Only the user himself can retrieve his own information.
   * @param id  Id of the user
   */
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

  /**
   * Update user's information. Only the user himself can update his own information.
   * @param id  Id of the user
   * @param body
   * @param body.name Name of the user
   * @param body.email Email of the user
   */
  @Put("/:id")
  @Middlewares(validate(userUpdateSchema))
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

  /**
   * Delete a user by id. Only the user himself can delete his own account.
   * @param id  Id of the user
   */
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
