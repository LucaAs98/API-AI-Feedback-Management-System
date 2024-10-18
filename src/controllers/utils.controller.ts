// src/controllers/productController.ts
import { Request, Response } from 'express';
import { createProduct } from '../services/product.service';
import { createFeedback } from './feedback.controller';
import { addFeedback, analyzeFeedback } from '../services/feedback.service';
/**
 * Handles bulk creation of products by processing them in chunks.
 * This function reads an array of products from the request body,
 * splits them into smaller chunks, processes each chunk sequentially,
 * and returns a summary of the successes and failures.
 *
 * @param {Request} req - The HTTP request object, expected to contain a 'products' array in the body.
 * @param {Response} res - The HTTP response object used to send back the results of the operation.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const createProductsInBulk = async (req: Request, res: Response): Promise<void> => {
  console.log('Request: ', req.url);

  try {
    const products = req.body.products;

    // Check that the products array is present and not empty.
    if (!Array.isArray(products) || products.length === 0) {
      res.status(400).json({ message: 'Products array is required and should not be empty.' });
      return; // Ensure to return here to stop further execution
    }

    // Split products into chunks of 10
    const productChunks = chunkArray(products, 10);

    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    const allErrors: string[] = [];

    // Process each chunk sequentially
    for (const chunk of productChunks) {
      // Use Promise.all to execute the operations in parallel within each chunk
      const results = await Promise.all(
        chunk.map(async (product: any) => {
          try {
            // Create a new product in the database
            const response = await createProduct(product);
            return { success: true, response };
          } catch (error) {
            return { success: false, error: error.message };
          }
        })
      );

      // Filter the results for errors and successes
      const successfulCreations = results.filter((result) => result.success);
      const failedCreations = results.filter((result) => !result.success);

      // Update total counts
      totalSuccessCount += successfulCreations.length;
      totalFailureCount += failedCreations.length;
      allErrors.push(...failedCreations.map((failure) => failure.error));
    }

    // Prepare the final response
    const responseMessage = {
      success_count: totalSuccessCount,
      failure_count: totalFailureCount,
      errors: allErrors,
    };

    // Return the response with the operation results
    res.status(201).json(responseMessage);
  } catch (error) {
    res.status(500).json({ message: `An unexpected error occurred: ${error.message}` });
  }
};

/**
 * Handles bulk creation of feedback by processing them in chunks.
 * This function reads an array of feedback from the request body,
 * splits them into smaller chunks, processes each chunk sequentially,
 * and returns a summary of the successes and failures.
 *
 * @param {Request} req - The HTTP request object, expected to contain a 'feedbacks' array in the body.
 * @param {Response} res - The HTTP response object used to send back the results of the operation.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const createFeedbacksInBulk = async (req: Request, res: Response): Promise<void> => {
  console.log('Request: ', req.url);

  try {
    const feedbacks = req.body.feedbacks;

    // Check that the feedbacks array is present and not empty.
    if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
      res.status(400).json({ message: 'Feedbacks array is required and should not be empty.' });
      return; // Ensure to return here to stop further execution
    }

    // Split feedbacks into chunks of 10
    const feedbackChunks = chunkArray(feedbacks, 5);

    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    const allErrors: string[] = [];

    // Process each chunk sequentially
    for (const chunk of feedbackChunks) {
      // Use Promise.all to execute the operations in parallel within each chunk
      const results = await Promise.all(
        chunk.map(async (feedback: any) => {
          //Analyze the feedback by keeping track of how long it takes
          const start = new Date().getTime();
          const feedbackScore = await analyzeFeedback(feedback.feedback_text);
          const end = new Date().getTime();
          const elapsedTime = end - start;

          // Create the feedback body, merging original request data with analyzed data and response time
          const createFeedbackBody = {
            ...feedback,
            feedback_score: feedbackScore,
            response_time: elapsedTime,
          };

          try {
            const response = await addFeedback(createFeedbackBody);
            return { success: true, response };
          } catch (error) {
            return { success: false, error: error.message };
          }
        })
      );

      // Filter the results for errors and successes
      const successfulCreations = results.filter((result) => result.success);
      const failedCreations = results.filter((result) => !result.success);

      // Update total counts
      totalSuccessCount += successfulCreations.length;
      totalFailureCount += failedCreations.length;
      allErrors.push(...failedCreations.map((failure) => failure.error));
    }

    // Prepare the final response
    const responseMessage = {
      success_count: totalSuccessCount,
      failure_count: totalFailureCount,
      errors: allErrors,
    };

    // Return the response with the operation results
    res.status(201).json(responseMessage);
  } catch (error) {
    res.status(500).json({ message: `An unexpected error occurred: ${error.message}` });
  }
};

// Function to chunk the products into groups of a specific size
const chunkArray = (array: any[], chunkSize: number) => {
  const result: any[] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};
