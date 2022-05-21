import { Client } from "@notionhq/client";

export async function fetchLatestPosts() {
  const notion = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
  const databaseId = "0042c77753d94b4293898147fc436910";
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 3,
    sorts: [
      {
        property: "PostedAt",
        direction: "descending",
      },
    ],
  });

 return response;
}
