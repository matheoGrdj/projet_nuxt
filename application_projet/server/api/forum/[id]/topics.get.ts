import db from "../../db";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const { page = 1, limit = 20 } = getQuery(event);
    const offset = (Number(page) - 1) * Number(limit);

    const topics = await db.any(`
      SELECT 
        t.*,
        u.username as author,
        lu.username as last_message_author,
        COUNT(m.id) as message_count
      FROM topics t
      JOIN users u ON t.user_id = u.id
      JOIN users lu ON t.last_message_user_id = lu.id
      LEFT JOIN messages m ON m.topic_id = t.id
      WHERE t.forum_id = $1
      GROUP BY t.id, u.username, lu.username
      ORDER BY t.last_message_at DESC
      LIMIT $2 OFFSET $3
    `, [id, limit, offset]);

    const totalCount = await db.one(`
      SELECT COUNT(*) FROM topics WHERE forum_id = $1
    `, [id]);

    return {
      topics,
      pagination: {
        total: parseInt(totalCount.count),
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(parseInt(totalCount.count) / Number(limit))
      }
    };
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch topics'
    });
  }
});