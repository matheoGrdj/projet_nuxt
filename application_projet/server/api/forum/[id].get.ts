import db from "../db";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    
    const forum = await db.one(`
      SELECT f.*, 
        (SELECT COUNT(*) FROM topics t WHERE t.forum_id = f.id) as topic_count
      FROM forums f 
      WHERE f.id = $1
    `, [id]);

    return { forum };
  } catch (error) {
    console.error('Error fetching forum:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch forum'
    });
  }
});