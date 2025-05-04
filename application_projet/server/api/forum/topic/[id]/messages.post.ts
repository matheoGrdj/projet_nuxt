import { v4 as uuidv4 } from "uuid";
import db from "../../../db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: string };
    return decoded.id ?? null;
  } catch {
    return null;
  }
}

export default defineEventHandler(async (event) => {
  const topicId = event.context.params?.id;
  if (!topicId) {
    throw createError({
      statusCode: 400,
      message: "Topic ID is required",
    });
  }
  const { content } = await readBody(event);
  const authHeader = event.headers.get("Authorization");
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }
  const token = authHeader.split(" ")[1];
  const userId = getUserIdFromToken(token);
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }

  try {
    // Add the message to the database
    const messageId = await db.one(
      `
      INSERT INTO messages (topic_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
      [topicId, userId, content]
    );

    // Update the topic's last message info
    await db.none(
      `
      UPDATE topics
      SET last_message_user_id = $1, last_message_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `,
      [userId, topicId]
    );

    return {
      success: true,
      message: {
        id: messageId,
        content,
        user_id: userId,
      },
    };
  } catch (error) {
    console.error("Error creating message:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create message",
    });
  }
});
