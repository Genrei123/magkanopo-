"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scrape_1 = require("../controllers/scrape");
const scrapeRoute = (0, express_1.Router)();
scrapeRoute.get("/all", scrape_1.allController);
exports.default = scrapeRoute;
