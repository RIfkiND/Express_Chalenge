import { error } from "console";
import { Request, Response, NextFunction } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"

interface Auth extends Request{
    [x: string]: any; // x-interface
    user?: any  
}

//create an middleware for express
export const Auth = (
  req: Auth,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(StatusCodes.UNAUTHORIZED).send({error : getReasonPhrase(StatusCodes.UNAUTHORIZED)});

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(StatusCodes.UNAUTHORIZED).send({err : getReasonPhrase(StatusCodes.UNAUTHORIZED)});

    req.user = user;
    next();
  });
};