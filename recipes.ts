import type { Client } from "@notionhq/client";

export async function getRecipe(notion: Client, db: string, id: number) {
  const response = await notion.databases.query({
    database_id: db,
    filter: {
      property: "ID",
      number: { equals: id },
    },
  });

  return response;
}

export async function addRecipe(notion: Client, db: string, id: number) {
  const response = await notion.databases.query({
    database_id: db,
    filter: {
      property: "ID",
      number: { equals: id },
    },
  });

  const ingredients = (
    response.results[0] as any
  )?.properties?.Zutaten?.multi_select.map(
    (ingredient: any) => ingredient?.name
  );

  return ingredients;
}
