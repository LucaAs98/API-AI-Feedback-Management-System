import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { Client } from 'pg';
import dotenv from 'dotenv';

//Routes
import userRoutes from './routes/userRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

//Swagger
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
const allowedOrigins = process.env.ALLOWED_ORIGINS || ([] as string[]);

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Necessary to support credentials
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'], // Ensure to include all necessary headers
};

app.use(cors(corsOptions));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Start the database connection
connectToDatabase();

//Swagger init
swaggerInit();

// Create and start the server
const server = http.createServer(app);

// API Routes
app.use(userRoutes);
app.use(feedbackRoutes);

server.listen(PORT, () => {
  console.log(`- Server running on http://localhost:8080/ \n- API Documentation on http://localhost:8080/api-docs`);
});

function swaggerInit() {
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API for My Application',
      },
      servers: [
        {
          url: 'http://localhost:8080',
        },
      ],
    },
    apis: ['./src/routes/*.ts'], // Path to your API routes
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Add a new route to serve the OpenAPI JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
}
