import { Router } from "express";
import { TGPController, SouthstarController, allController } from "../controllers/scrape";

const scrapeRoute = Router();

scrapeRoute.get("/tgp", TGPController);
scrapeRoute.get("/southstar", SouthstarController);
scrapeRoute.get("/all", allController);

export default scrapeRoute;

