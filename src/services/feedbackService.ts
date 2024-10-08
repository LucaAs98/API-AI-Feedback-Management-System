import { feedback as Feedback, Prisma, PrismaClient } from '@prisma/client';
import { getPrismaError } from '../utils/helpers';
import axios from 'axios';

type AnalyzedFeedback = {
  sentiment: string;
  positive_score: number;
  negative_score: number;
  neutral_score: number;
  mixed_score: number;
};

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Retrieves all feedback entries from the database.
 *
 * @returns {Promise<Feedback[]>} A promise that resolves to an array of feedback entries.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getFeedbacks = async (): Promise<Feedback[]> => {
  try {
    return await prisma.feedback.findMany();
  } catch (error) {
    const errorMessage = getPrismaError(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Creates a new feedback entry in the database.
 *
 * @param {Prisma.feedbackCreateInput} data - The feedback data to be created.
 * @returns {Promise<Feedback>} A promise that resolves to the created feedback entry.
 * @throws {Error} Throws an error if the database query fails.
 */
export const createFeedback = async (data: Prisma.feedbackCreateInput): Promise<Feedback> => {
  try {
    return await prisma.feedback.create({ data });
  } catch (error) {
    const errorMessage = getPrismaError(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Analyzes the given feedback using the AWS API for sentiment analysis.
 * @param feedback - The feedback text to be analyzed.
 * @returns A promise that resolves to the sentiment analysis result.
 */
export const analyzeFeedback = async (feedback: string): Promise<AnalyzedFeedback> => {
  // Define the API URL for the AWS endpoint
  const apiUrl = 'https://ducf7s8m8j.execute-api.us-east-1.amazonaws.com/develop/feedback';

  try {
    // Send a POST request to the API with the feedback as the request body
    const response = await axios.post(apiUrl, { feedback });

    // Check if the response is successful and contains sentiment data
    if (response.status === 200 && response.data) {
      // Extract the sentiment result from the response data
      const resultList = response.data.ResultList[0];

      // Return the sentiment analysis result
      return {
        sentiment: resultList.Sentiment,
        positive_score: resultList.SentimentScore.Positive,
        negative_score: resultList.SentimentScore.Negative,
        neutral_score: resultList.SentimentScore.Neutral,
        mixed_score: resultList.SentimentScore.Mixed,
      };
    } else {
      // If response is not successful, throw an error
      throw new Error('No sentiment data found in the response.');
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error while analyzing the feedback:', error);
    // Throw a new error to handle it in the calling function
    throw new Error('Error while analyzing the feedback.'); // Customize this message as needed
  }
};
