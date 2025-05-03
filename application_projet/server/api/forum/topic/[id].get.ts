import db from "../../db";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    
    const topic = await db.one(`
      SELECT t.*,
             u.username as author,
             (SELECT COUNT(*) FROM messages WHERE topic_id = t.id) as message_count
      FROM topics t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `, [id]);

    return { topic };
  } catch (error) {
    console.error('Error fetching topic:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch topic'
    });
  }
});