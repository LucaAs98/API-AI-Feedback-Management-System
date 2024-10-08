import express from 'express';
import {
  getAllFeedbacks,
  addFeedback,
} from '../controllers/feedbackController';

const router = express.Router();

/**
 * @swagger
 * /feedbacks:
 *   get:
 *     summary: Retrieve all feedbacks
 *     tags: [Feedbacks]
 *     responses:
 *       200:
 *         description: A list of feedback objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 123
 *                   feedback_text:
 *                     type: string
 *                     example: "Great service!"
 *                   response_text:
 *                     type: string
 *                     example: "Thank you for your feedback!"
 *                   feedback_time:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-08T12:34:56Z"
 *                   response_time:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-09T14:22:33Z"
 *       500:
 *         description: Internal server error
 */
router.get('/feedbacks', getAllFeedbacks); // Get all feedbacks

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     summary: Create new feedback
 *     tags: [Feedbacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 123
 *               feedback_text:
 *                 type: string
 *                 example: "Great service!"
 *               response_text:
 *                 type: string
 *                 example: "Thank you for your feedback!"
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/feedbacks', addFeedback); // Create new feedback

export default router;
