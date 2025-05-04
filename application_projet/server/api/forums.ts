import db from "./db";

export default defineEventHandler(async (event) => {
  // try {
  const forums = await db.any("SELECT * FROM forums");
  const forumsWithTopics = await Promise.all(
    forums.map(async (forum) => {
      const topics =
        (await db.any("SELECT * FROM topics WHERE forum_id = $1", [
          forum.id,
        ])) || []; // Ensure topics is always an array
      return {
        ...forum,
        topics,
        updated_at: forum.updated_at || new Date(), // Provide default date
      };
    })
  );
  return { forums: forumsWithTopics };
  // } catch (error) {
  //   console.error('Error fetching forums:', error);
  //   throw createError({
  //     statusCode: 500,
  //     message: 'Failed to fetch forums'
  //   });
  // }
});
