import { Prisma, PrismaClient, feedback as Feedback } from '@prisma/client';
import { getPrismaError } from '../utils/helpers';

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
export const createFeedback = async (
  data: Prisma.feedbackCreateInput
): Promise<Feedback> => {
  try {
    return await prisma.feedback.create({ data });
  } catch (error) {
    const errorMessage = getPrismaError(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
