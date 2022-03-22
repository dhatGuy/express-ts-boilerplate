class HttpException extends Error {
  statusCode?: number;
  status?: string;
  message: string;
  errors?: unknown[];

  constructor(statusCode: number, message: string, errors?: unknown[]) {
    super(message);
    this.status = "error";
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors || [];
  }
}

export default HttpException;
