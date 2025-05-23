import { v4 as uuidv4 } from "uuid";
import db from "../../db";
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
  const forumId = event.context.params?.id;
  if (!forumId) {
    throw createError({
      statusCode: 400,
      message: "Forum ID is required",
    });
  }
  const { title, content } = await readBody(event);

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
    let createdTopicId;

    await db.tx(async (t) => {
      // Create topic
      const topicResult = await t.one(
        `
        INSERT INTO topics (forum_id, user_id, title, last_message_user_id)
        VALUES ($1, $2, $3, $2)
        RETURNING id
      `,
        [forumId, userId, title]
      );

      createdTopicId = topicResult.id;

      // Create initial message
      const messageId = await t.one(
        `
        INSERT INTO messages (topic_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
        [createdTopicId, userId, content]
      );
    });

    return {
      success: true,
      topic: {
        id: createdTopicId,
        title,
        user_id: userId,
      },
    };
  } catch (error) {
    console.error("Error creating topic:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create topic",
    });
  }
});
