import db from "../api/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || typeof username !== "string") {
    return { success: false, message: "username valide est requis" };
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return {
      success: false,
      message: "Mot de passe valide est requis (au moins 8 caractères)",
    };
  }

  const id = uuidv4();
  const hash = await bcrypt.hash(password, 10);

  await db.none(
    "INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3)",
    [id, username, hash]
  );
  return { success: true };
});
