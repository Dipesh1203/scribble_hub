import express from "express";
import cors from "cors";
import router from "./routes";
import bcrypt from "bcrypt";

const allowedOrigins = [
  'http://localhost:3000', // standard next.js port
  'http://localhost:3003', // standard next.js port
  'https://scribbledraw-frontend.vercel.app', // Your production frontend origin
  process.env.FRONTEND_URL?.replace(/['";\s]/g, ''), // Clean trailing semicolons, spaces, or quotes
  process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/['";\s]/g, ''),
].filter(Boolean) as string[];

const app: express.Application = express();
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or REST client requests (origin is undefined)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // Do not throw an error; let CORS middleware handle it by omitting headers
    }
  },
  credentials: true, // Allow tokens/cookies if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(router);
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[Local Server] Running smoothly on port ${PORT}`);
  });
}

export default app;