import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema, userSchema } from "../../schema/userschema";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      //validation
      const { error } = userSchema.validate(req.body);
      if (error)
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      //request user credentials
      const { name, email, password } = req.body;

      //logic to check existinguser
      const existingUser = await User.FindUser(email);

      if (existingUser) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: "Email already exists" });
        return;
      }
       const saltRounds = 10;
       const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.CreateUser(name, email, hashedPassword);

      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
  }

  //logic to login
  async login(req: Request, res: Response): Promise<void> {
    try {
      // validation
      const { error } = loginSchema.validate(req.body);
      if (error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: getReasonPhrase(StatusCodes.BAD_REQUEST) });
        return;
      }

      const { email, password } = req.body;

      // Find user  email
      const user = await User.FindUser(email);

      if (!user) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Invalid email or password" });
        return;
      }

      //  Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password!);
      if (!isMatch) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: "password incorect" });
        return;
      }
      //  generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.AUTH_SECRET!,
        { expiresIn: "1h" }
      );

      // Return token with success
      res.json({ token });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
  }
}

export default new AuthController();
