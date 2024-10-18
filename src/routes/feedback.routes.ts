import express from 'express';
import { getAllFeedbacks, createFeedback } from '../controllers/feedback.controller';

const router = express.Router();

/**
 * GET /feedback
 * Retrieves a list of all feedbacks submitted by users.
 */
router.get('/feedback', getAllFeedbacks); // Get all feedbacks

/**
 * POST /feedback
 * Allows users to submit new feedback.
 * This route expects a request body containing user_id and feedback_text.
 */
router.post('/feedback', createFeedback); // Create new feedback

export default router;
