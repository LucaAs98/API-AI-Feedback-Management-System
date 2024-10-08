import express from 'express';
import { getAllFeedbacks, addFeedback } from '../controllers/feedbackController';

const router = express.Router();

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get all feedbacks
 *     description: Retrieve a list of all feedbacks submitted by users.
 *     responses:
 *       '200':
 *         description: A list of feedbacks
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
 *                     example: "This is a feedback message."
 *                   feedback_time:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-08T12:34:56Z"
 *                   response_time:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2024-10-08T12:34:56Z"
 *                   sentiment:
 *                     type: string
 *                     enum: [POSITIVE, NEGATIVE, NEUTRAL, MIXED]
 *                     nullable: true
 *                     example: "POSITIVE"
 *                   positive_score:
 *                     type: number
 *                     format: float
 *                     nullable: true
 *                     example: 0.9996839761734009
 *                   negative_score:
 *                     type: number
 *                     format: float
 *                     nullable: true
 *                     example: 0.00005056627560406923
 *                   neutral_score:
 *                     type: number
 *                     format: float
 *                     nullable: true
 *                     example: 0.000262411602307111
 *                   mixed_score:
 *                     type: number
 *                     format: float
 *                     nullable: true
 *                     example: 0.000003055851038880064
 */
router.get('/feedback', getAllFeedbacks); // Get all feedbacks

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Create new feedback
 *     description: Submit a new feedback.
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
 *                 example: "This is a new feedback message."
 *               sentiment:
 *                 type: string
 *                 enum: [POSITIVE, NEGATIVE, NEUTRAL, MIXED]
 *                 nullable: true
 *                 example: "POSITIVE"
 *               positive_score:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *                 example: 0.9996839761734009
 *               negative_score:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *                 example: 0.00005056627560406923
 *               neutral_score:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *                 example: 0.000262411602307111
 *               mixed_score:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *                 example: 0.000003055851038880064
 *     responses:
 *       '201':
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 123
 *                 feedback_text:
 *                   type: string
 *                   example: "This is a new feedback message."
 *                 feedback_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-08T12:34:56Z"
 *                 response_time:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *                 sentiment:
 *                   type: string
 *                   enum: [POSITIVE, NEGATIVE, NEUTRAL, MIXED]
 *                   nullable: true
 *                   example: "POSITIVE"
 *                 positive_score:
 *                   type: number
 *                   format: float
 *                   nullable: true
 *                   example: 0.9996839761734009
 *                 negative_score:
 *                   type: number
 *                   format: float
 *                   nullable: true
 *                   example: 0.00005056627560406923
 *                 neutral_score:
 *                   type: number
 *                   format: float
 *                   nullable: true
 *                   example: 0.000262411602307111
 *                 mixed_score:
 *                   type: number
 *                   format: float
 *                   nullable: true
 *                   example: 0.000003055851038880064
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post('/feedback', addFeedback); // Create new feedback

export default router;
