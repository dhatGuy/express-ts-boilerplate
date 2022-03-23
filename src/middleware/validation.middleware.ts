import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import HttpException from "../common/http-exception";
import { HttpStatus } from "../interfaces/httpStatus";
import logger from "../utils/logger";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // const errorMessage = error.message
        //   .map((details) => details.message)
        //   .join(", ");
        logger.info(error.flatten());
        throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, error.message);
      }
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };
