import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

interface Auth{
    [x: string]: any; // x-interface
    user?: any  
}

//create an middleware for express
export const authenticateToken = (
  req: Auth,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
};