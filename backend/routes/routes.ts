import { Router } from "express";
import { allController } from "../controllers/scrape";

const scrapeRoute = Router();

scrapeRoute.get("/all", allController);

export default scrapeRoute;

