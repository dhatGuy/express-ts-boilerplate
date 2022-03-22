import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../interfaces/httpStatus";

export const notFoundMiddleware = (
  request: Request,
  response: Response,
  _next: NextFunction
) => {
  const message = "Resource not found";

  response.status(HttpStatus.NOT_FOUND).send(message);
};
