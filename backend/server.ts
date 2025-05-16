import express from 'express';
import { Request, Response } from 'express';
import scrapeRoute from './routes/routes';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import 'dotenv/config';


const app = express();
const port = 3000;


app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [FRONTEND_URL];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(options));

app.use("/scrape", scrapeRoute);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello World!');
});