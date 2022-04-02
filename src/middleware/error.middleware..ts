import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import HttpException from "../common/http-exception";
import { HttpStatus } from "../interfaces/httpStatus";
import logger from "../utils/logger";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message, status, errors } = error;
  logger.error(error);

  if (error instanceof ValidateError) {
    logger.warn(`Caught Validation Error for ${req.path}:`, error.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: error?.fields,
    });
  }

  res.status(statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
    status,
    statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    message:
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR
        ? "Internal Server Error"
        : message,
    validationErrors: errors,
  });
  next();
};
