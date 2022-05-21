import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import { getRecipe } from "./recipes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const recipesId = process.env.RECIPES_ID;
const notionKey = process.env.NOTION_API_KEY;

const notion = new Client({ auth: notionKey });

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/recipes/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"]);
  if (!recipesId) {
    return res.send("Error: No database id provided");
  }

  const recipe = await getRecipe(notion, recipesId, id);
  res.send(recipe);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
