import express from "express";
import cors from "cors";
import router from "./routes";
import bcrypt from "bcrypt";

const allowedOrigins = [
  'http://localhost:3000', // standard next.js port
  'http://localhost:3003', // The port your log shows you are using
  process.env.FRONTEND_URL || 'http://localhost:3000', // Allow environment variable or default to localhost
];

const app = express();
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or REST client requests (origin is undefined)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true, // Allow tokens/cookies if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(router);
app.listen(3000);
