import db from "../api/db";

export default defineEventHandler(async (event) => {
  const forums = await db.any("SELECT * FROM forums");

  const forumsWithTopics = await Promise.all(
    forums.map(async (forum) => {
      const topics = await db.any("SELECT * FROM topics WHERE forum_id = $1", [
        forum.id,
      ]);
      return { ...forum, topics };
    })
  );

  return { forums: forumsWithTopics };
});
