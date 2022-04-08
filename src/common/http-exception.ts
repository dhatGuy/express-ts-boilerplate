interface ZodFlatError {
  formErrors: string[];
  fieldErrors: {
    [k: string]: string[];
  };
}
class HttpException extends Error {
  statusCode?: number;
  status?: string;
  message: string;
  errors?: ZodFlatError | undefined;

  constructor(statusCode: number, message: string, errors?: ZodFlatError) {
    super(message);
    this.status = "error";
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

export default HttpException;
