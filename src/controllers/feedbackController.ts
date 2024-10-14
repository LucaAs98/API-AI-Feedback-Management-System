import { Request, Response } from 'express';
import { createFeedback, getFeedbacks, analyzeFeedback } from '../services/feedbackService';
import { validateRequestBody } from '../utils/helpers';

/**
 * Fetches all feedbacks from the database.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getAllFeedbacks = async (req: Request, res: Response): Promise<void> => {
  console.log('Request: ', req.url);

  try {
    const feedbacks = await getFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({
      message: `Error while retrieving all the feedbacks: ${error.message}`,
    });
  }
};

/**
 * Handles the addition of feedback to the database.
 *
 * @param {Request} req - The request object containing feedback data.
 * @param {Response} res - The response object used to send the result of the feedback creation process.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const addFeedback = async (req: Request, res: Response): Promise<void> => {
  console.log('Request: ', req.url);

  try {
    // Validate the request body
    const validationError = validateRequestBody(req, res, ['feedback_text', 'user_id']);
    if (validationError) return;

    //Analyze the feedback by keeping track of how long it takes
    const start = new Date().getTime();
    const analyzedFeedback = await analyzeFeedback(req.body.feedback_text);
    const end = new Date().getTime();
    const elapsedTime = end - start;

    // Create the feedback body, merging original request data with analyzed data and response time
    const createFeedbackBody = {
      ...req.body,
      ...analyzedFeedback,
      response_time: elapsedTime,
    };

    // Create a new feedback entry in the database and send the response
    const response = await createFeedback(createFeedbackBody);

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: `Error while adding a feedback: ${error.message}` });
  }
};
