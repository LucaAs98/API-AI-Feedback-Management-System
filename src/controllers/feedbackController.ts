import { Request, Response } from 'express'; // Assuming you're using Express
import { createFeedback, getFeedbacks } from '../services/feedbackService';

/**
 * Fetches all feedbacks from the database.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getAllFeedbacks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feedbacks = await getFeedbacks();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({
      message: `Error while retrieving all the feedbacks: ${error.message}`,
    });
  }
};

/**
 * Adds a new feedback to the database.
 *
 * @param {Request} req - The request object containing feedback data.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const addFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await createFeedback(req.body);
    res.status(201).json(response);
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error while adding a feedback: ${error.message}` });
  }
};
