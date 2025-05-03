import { v4 as uuidv4 } from 'uuid';
import db from "../../db";

export default defineEventHandler(async (event) => {
  const forumId = event.context.params.id;
  const { title, content } = await readBody(event);
  const userId = event.context.user?.id; // From auth middleware

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    });
  }

  try {
    const topicId = uuidv4();
    const messageId = uuidv4();
    
    await db.tx(async t => {
      // Create topic
      await t.one(`
        INSERT INTO topics (id, forum_id, user_id, title, last_message_user_id)
        VALUES ($1, $2, $3, $4, $3)
        RETURNING id
      `, [topicId, forumId, userId, title]);

      // Create initial message
      await t.one(`
        INSERT INTO messages (id, topic_id, user_id, content)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [messageId, topicId, userId, content]);
    });

    return {
      success: true,
      topic: {
        id: topicId,
        title,
        user_id: userId
      }
    };
  } catch (error) {
    console.error('Error creating topic:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create topic'
    });
  }
});