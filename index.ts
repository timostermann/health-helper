import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import { addRecipe, getRecipe } from "./recipes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const recipesId = process.env.RECIPES_ID;
const notionKey = process.env.NOTION_API_KEY;

const notion = new Client({ auth: notionKey });

app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
  res.render("pages/index");
});

app.get("/recipes/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"]);
  if (!recipesId) {
    return res.send("Error: No database id provided");
  }

  const recipe = await getRecipe(notion, recipesId, id);
  res.send(recipe);
});

app.get("/recipes/add/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"]);
  if (!recipesId) {
    return res.send("Error: No database id provided");
  }

  const { name, ingredients } = await addRecipe(notion, recipesId, id);

  res.render("pages/bring", {
    ingredients: ingredients,
    name: name,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
