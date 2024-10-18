import { feedback as Feedback, Prisma, PrismaClient } from '../../prisma/generated';
import { getPrismaError } from '../utils/helpers';
import axios from 'axios';

const MODEL_URL = 'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment';

const prisma = new PrismaClient(); // Initialize Prisma Client

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
export const addFeedback = async (data: Prisma.feedbackCreateInput): Promise<Feedback> => {
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
export const analyzeFeedback = async (feedback: string): Promise<number> => {
  try {
    const response = await axios.post(
      MODEL_URL,
      { inputs: feedback },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`, 'Content-Type': 'application/json' },
      }
    );

    // Extract the sentiment with the highest score.
    const result = response.data[0].reduce(
      (max: { label: string; score: number }, current: { label: string; score: number }) => (current.score > max.score ? current : max),
      response.data[0][0]
    );

    return parseInt(result.label[0]);
  } catch (error) {
    const errorMessage = 'Error while analyzing the feedback: ' + error.response?.data?.error;

    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
