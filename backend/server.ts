import express from 'express';
import scrapeRoute from './routes/routes';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import 'dotenv/config';


const server_app = express();
const port = 3000;


server_app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [FRONTEND_URL];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
server_app.use(cors(options));

server_app.use("/scrape", scrapeRoute);

server_app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});

export default server_app;