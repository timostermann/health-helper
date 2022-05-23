import type { Client } from "@notionhq/client";
import fetch from "node-fetch";

export async function addRecipe(
  notion: Client,
  db: string,
  recipe: any,
  link: string
) {
  const parsedRecipe: any = recipe["@graph"][2];
  console.log(parsedRecipe);
  const name = parsedRecipe?.name;
  const image = parsedRecipe?.image;
  const calories = parseInt(parsedRecipe?.nutrition?.calories ?? "0");
  const protein = parseInt(parsedRecipe?.nutrition?.proteinContent ?? "0");
  const ingredientList = parsedRecipe?.recipeIngredient?.join(", ");

  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Notion-Version": "2022-02-22",
      "Content-Type": "application/json",
      Authorization: ``,
    },
    body: JSON.stringify({
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Bild: { url: image },
        "Kcal pro Person (ca.)": calories,
        "Protein pro Portion (ca.)": protein,
        Zutatenliste: ingredientList,
        Link: link,
      },
    }),
  };

  const response = await notion.pages.create({
    parent: { database_id: db },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Bild: {
        files: [{ name: name, external: { url: image } }],
      },
      "Kcal pro Person (ca.)": {
        number: calories,
      },
      "Protein pro Portion (ca.)": {
        number: protein,
      },
      Zutatenliste: {
        rich_text: [
          {
            text: { content: ingredientList },
          },
        ],
      },
      Link: {
        url: link,
      },
    },
  });

  return parsedRecipe;
}

export async function buyRecipe(notion: Client, db: string, id: number) {
  const response = await notion.databases.query({
    database_id: db,
    filter: {
      property: "ID",
      number: { equals: id },
    },
  });

  const ingredients = (
    response.results[0] as any
  )?.properties?.Zutaten?.multi_select?.map(
    (ingredient: any) => ingredient?.name
  );

  const name = (response.results[0] as any)?.properties?.Name?.title[0]?.text
    ?.content;

  return { ingredients: ingredients, name: name };
}
