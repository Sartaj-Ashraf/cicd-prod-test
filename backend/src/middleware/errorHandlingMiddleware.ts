import type { Request,Response,NextFunction } from "express";

const errorHandlerMiddleware = (err:any, req:Request, res:Response, next:NextFunction) => {
  let statusCode = err.statusCode || 500
  let message = err.message || "Something went wrong, Try again later...";
  res.status(statusCode).json({ message });
};

export default errorHandlerMiddleware;