import { PrismaClient } from '../../prisma/generated';
import { getPrismaError } from '../utils/helpers';

export type ProductStatistics = {
  averageScore: number; // The average score of the feedback
  significantSummary: string; // A meaningful summary of all feedback
};

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Retrieves the average feedback score for a product by its ID.
 *
 * @param {number} id - The ID of the product whose average score is to be calculated.
 * @returns {Promise<number | null>} -
 *          A promise that resolves to the average feedback score if found, or null if no feedback exists for the given ID.
 * @throws {Error} - Throws an error if the retrieval operation fails due to database errors or other issues.
 */
export const getAverageFeedbackScoreByProductId = async (id: number): Promise<number | null> => {
  try {
    // Retrieve all feedbacks for the specified product
    const feedbacks = await prisma.feedback.findMany({
      where: { product_id: id }, // Filter by product ID
      select: {
        feedback_score: true, // Only select the feedback score
      },
    });

    // Check if feedbacks exist
    if (feedbacks.length === 0) return null; // Return null if no feedbacks are found

    // Calculate the average score
    const totalScore = feedbacks.reduce((acc, feedback) => acc + (feedback.feedback_score || 0), 0);
    const averageScore = totalScore / feedbacks.length;

    return averageScore; // Return the average score
  } catch (error) {
    const errorMessage = getPrismaError(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
