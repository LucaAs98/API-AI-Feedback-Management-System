import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { Client } from 'pg'; // Import PostgreSQL client
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const PORT = 8080;

// Configure the client for database connection
const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

// Connect to the database
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Database connection error', error);
    process.exit(1); // Exit the process if connection fails
  }
};

// Middleware
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Start the database connection
connectToDatabase();

// Create and start the server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('Server running on http://localhost:8080/');
});
