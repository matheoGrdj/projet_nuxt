import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string | undefined;

export default defineEventHandler(async (event) => {
  const { req } = event.node;
  const url = req.url || "";

  // Liste des routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ["/api/login", "/api/register"];

  if (
    url.startsWith("/api") &&
    !publicRoutes.some((route) => url.includes(route))
  ) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return createError({
        statusCode: 401,
        message: "Unauthorized: Authentication token is required",
      });
    }

    try {
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      event.context.user = decoded;
    } catch (err) {
      return createError({
        statusCode: 401,
        message: "Unauthorized: Invalid or expired token",
      });
    }
  }
});
