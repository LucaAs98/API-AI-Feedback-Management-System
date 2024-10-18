import express from 'express';
import { createFeedbacksInBulk, createProductsInBulk } from '../controllers/utils.controller';

const router = express.Router();

router.post('/utils/create-products-in-bulk', createProductsInBulk);
router.post('/utils/create-feedbacks-in-bulk', createFeedbacksInBulk);

export default router;
