import express from 'express';
import { Request, Response } from 'express';
import scrapeRoute from './routes/routes';
import cors from 'cors';

const app = express();
const port = 3000;


app.use(express.json());


const allowedOrigins = ['http://localhost:5173'];
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