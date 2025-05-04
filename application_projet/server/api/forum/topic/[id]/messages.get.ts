import db from "../../../db";

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params || {};
    const { page = 1, limit = 20 } = getQuery(event);
    const offset = (Number(page) - 1) * Number(limit);

    const messages = await db.any(
      `
      SELECT m.*,
             u.username as author
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.topic_id = $1
      ORDER BY m.created_at ASC
      LIMIT $2 OFFSET $3
    `,
      [id, limit, offset]
    );

    const totalCount = await db.one(
      `
      SELECT COUNT(*) FROM messages WHERE topic_id = $1
    `,
      [id]
    );

    return {
      messages,
      pagination: {
        total: parseInt(totalCount.count),
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(parseInt(totalCount.count) / Number(limit)),
      },
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch messages",
    });
  }
});
