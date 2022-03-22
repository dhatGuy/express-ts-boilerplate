import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http-exception";
import { HttpStatus } from "../interfaces/httpStatus";
import logger from "../utils/logger";

export const errorMiddleware = (
  error: HttpException,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message, status, errors } = error;
  logger.error(error);
  res.status(statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
    status,
    statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    message:
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR
        ? "An error occurred"
        : message,
    validationErrors: errors,
  });
  next();
};
