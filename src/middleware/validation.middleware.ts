import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import HttpException from "../common/http-exception";
import { HttpStatus } from "../interfaces/httpStatus";
import logger from "../utils/logger";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      logger.info(error);
      if (error instanceof ZodError) {
        throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, error.message);
      }
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };
