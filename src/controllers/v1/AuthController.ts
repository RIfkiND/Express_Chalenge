import { Request, Response } from "express";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { loginSchema, userSchema } from "../../schema/userschema";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

class AuthController {
  async register(req: Request, res: Response) {
    try {
        //validation
      const { error } = userSchema.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });
      //request user credentials
      const { name, email, password } = req.body;

      //logic to check existinguser
      const existingUser = await User.FindUser(email);  

      if (existingUser)
        return res.status(400).json({ message: "Email already exists" });

      const user = await User.CreateUser(name, email, password);

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  //logic to login
  async login(req: Request, res: Response) {
   try {
     // validation
     const { error } = loginSchema.validate(req.body);
     if (error)
       return res.status(400).json({ message: error.details[0].message });

     const { email, password } = req.body;

     // Find user  email
     const user = await User.FindUser(email);

     if (!user) {
       return res.status(401).json({ message: "Invalid email or password" });
     }

     //  Compare hashed password
     const isMatch = await bcrypt.compare(password, user.password!);
     if (!isMatch) {
       return res.status(401).json({ message: "password incorect" });
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
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR  )});
   }
  }
}

export default new AuthController();
