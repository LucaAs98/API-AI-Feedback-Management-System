import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

//Routes
import userRoutes from './routes/user.routes';
import feedbackRoutes from './routes/feedback.routes';
import productRoutes from './routes/product.routes';

//Swagger
import yaml from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import utilsRoutes from './routes/utils.routes';

dotenv.config(); // Load environment variables

const app = express();
const PORT = 8080;

// CORS
initCORS();

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
app.use(productRoutes);
app.use(utilsRoutes);

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/favicon.ico'));
});

app.get<{}, string>('/', (req, res) => {
  res.json('API Critic Hub is working!');
});

server.listen(PORT, () => {
  console.log(`- Server running on ${process.env.SERVER_URL} \n- API Documentation on ${process.env.SERVER_URL}/api-docs`);
});

export default app;
/** Initializes Swagger documentation for the API. */
async function swaggerInit() {
  // Loads the OpenAPI specifications from a YAML file
  const swaggerDocs = yaml.load(process.cwd() + '/src/swagger.yaml');

  //Sets up the Swagger UI to serve the API documentation at the '/api-docs' route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Creates an endpoint to serve the OpenAPI JSON at '/api-docs.json'
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
}

/**
 * Initializes CORS (Cross-Origin Resource Sharing) for the API.
 *
 * This function configures CORS settings to specify which origins are allowed
 * to access the API. It supports various HTTP methods and includes necessary
 * headers for authorization and content type.
 */
function initCORS() {
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
}

function connectToDatabase() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.DB_CERTIFICATE,
    },
  };

  const client = new Client(config);

  client.connect(function (err) {
    if (err) throw err;
    client.query('SELECT VERSION()', [], function (err, result) {
      if (err) throw err;

      console.log(result.rows[0].version);
      client.end(function (err) {
        if (err) throw err;
      });
    });
  });
}
