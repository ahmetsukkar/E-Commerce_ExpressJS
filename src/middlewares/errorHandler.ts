import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      data: err.message,
      statusCode: err.statusCode,
    });
  }

  console.error("Unexpected Error:", err);

  return res.status(500).json({
    data: `Internal server error: ${err.message}`,
    statusCode: 500,
  });
};

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
