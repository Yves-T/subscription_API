import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const errorMiddleware: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(err);
    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
