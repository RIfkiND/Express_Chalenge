import { validate } from "./../../node_modules/@types/uuid/index.d";
import pool from "../config/db";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { userSchema } from "../schema/userschema";
import { IUser } from "../types/UserType";


class User {
  async FindUser(email: string): Promise<IUser | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  }

  async CreateUser(
    name: string,
    email: string,
    password: string
  ): Promise<IUser> {
    const { error } = userSchema.validate({ name, email, password });
    if (error) throw new Error(error.details[0].message);
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email",
      [id, name, email, hashedPassword]
    );
    return result.rows[0];
  }
}

export default new User();
