import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { Client } from "@notionhq/client";
import { addRecipe, buyRecipe } from "./recipes";
import { isValidHttpUrl } from "./utils";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const recipesId = process.env.RECIPES_ID;
const notionKey = process.env.NOTION_API_KEY;

app.use(express.json());

const notion = new Client({ auth: notionKey });

app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
  res.render("pages/index");
});

app.post("/recipes/new/", async (req: Request, res: Response) => {
  const link = req.body["link"];
  console.log(link);
  if (!recipesId) {
    return res.send("Error: No database id provided");
  }
  if (!isValidHttpUrl(link)) {
    return res.send("Error: No link provided");
  }

  const recipe = await fetch(link)
    .then((x) => x.text())
    .then((x) =>
      x.match(/<script type="application\/ld\+json">[^<>]*<\/script>/gm)
    )
    .then((x) =>
      x
        ?.toString()
        .replace(/\\/, "")
        .replace('<script type="application/ld+json">', "")
        .replace("</script>", "")
    )
    .then((x) => JSON.parse(x ?? ""));

  const response = await addRecipe(notion, recipesId, recipe, link);

  res.send(recipe);
});

app.get("/recipes/add/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"]);
  if (!recipesId) {
    return res.send("Error: No database id provided");
  }

  const { name, ingredients } = await buyRecipe(notion, recipesId, id);

  res.render("pages/bring", {
    ingredients: ingredients,
    name: name,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
