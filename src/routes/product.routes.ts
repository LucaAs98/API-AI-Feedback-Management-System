import express from 'express';
import { addProduct, retrieveProductById, retrieveProductsByType } from '../controllers/product.controller';

const router = express.Router();

/**
 * GET /product/id/:id
 * Retrieves the details of a specific product by its ID. This route expects a product ID as a URL parameter.
 * If the product is found, the product details will be returned.
 * If the product is not found, a 404 error will be returned.
 * For other errors, a 500 error will be returned with an appropriate message.
 */
router.get('/product/id/:id', retrieveProductById);

/**
 * GET /product/type/:type
 * Retrieves all the products of a specific type. This route expects a product type as a URL parameter.
 * If the products are not found, an empty array will be returned.
 * For other errors, a 500 error will be returned with an appropriate message.
 */
router.get('/product/type/:type', retrieveProductsByType);

/**
 * POST /product
 * Allows the creation of a new product.
 * This route expects a request body containing product details: 'title', 'image', 'type', 'genre_category'
 * plus additional specific parameters based on the product type.
 */
router.post('/product', addProduct);
export default router;
