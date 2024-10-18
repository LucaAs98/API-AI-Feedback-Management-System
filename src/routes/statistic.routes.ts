import express from 'express';
import { retrieveProductStatistics } from '../controllers/statistic.controller';

const router = express.Router();

/**
 * GET /statistic/:id
 * Retrieves the statistic of a specific product by its ID. This route expects a product ID as a URL parameter.
 * If statistics are found, they will be returned.
 * If not, a 404 error will be returned.
 * For other errors, a 500 error will be returned with an appropriate message.
 */
router.get('/statistic/:id', retrieveProductStatistics); // Get statistics for productId

export default router;
