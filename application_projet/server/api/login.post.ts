import db from "../api/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || typeof username !== "string") {
    return { success: false, message: "username valide est requis" };
  }

  if (!password || typeof password !== "string") {
    return { success: false, message: "Mot de passe invalide" };
  }

  const user = await db.oneOrNone("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (user && (await bcrypt.compare(password, user.password_hash))) {
    const { password, ...userWithoutPassword } = user;

    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error("JWT_SECRET or JWT_REFRESH_SECRET is not defined");
    }

    const token = jwt.sign(userWithoutPassword, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(userWithoutPassword, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
    return { token, refreshToken, success: true };
  } else {
    return { success: false, message: "username ou mot de passe incorrect" };
  }
});
