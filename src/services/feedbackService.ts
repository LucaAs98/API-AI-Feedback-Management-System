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

const Models = {
  Llama3_2_1b: 'llama-3.2-1b-instruct',
} as const;

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
  const apiUrl = 'http://192.168.1.6:1234/v1/chat/completions';

  try {
    const chatCompletionBody = createChatBody(feedback);
    // Send a POST request to the AWS Lambda with the feedback as the request body
    const response = await axios.post(apiUrl, chatCompletionBody);

    // Check if the response is successful and contains sentiment data
    if (response.status === 200 && response.data) {
      const resultList = JSON.parse(response.data.choices[0].message.content); // Extract the sentiment result from the response data

      // Return the sentiment analysis result
      return {
        sentiment: resultList.Sentiment,
        positive_score: resultList.Positive,
        negative_score: resultList.Negative,
        neutral_score: resultList.Neutral,
        mixed_score: resultList.Mixed,
      };
    } else {
      // If response is not successful, throw an error
      throw new Error('No sentiment data found in the response.');
    }
  } catch (error) {
    console.error('Error while analyzing the feedback:', error);
    throw new Error('Error while analyzing the feedback.');
  }
};

function createChatBody(feedback: string) {
  return {
    model: Models.Llama3_2_1b,
    messages: [
      {
        role: 'user',
        content: `Analyze this sentence: "${feedback}". 

        Complete and return the following JSON structure with the analysis results:
        {
          "Sentiment": "Positive" | "Negative" | "Neutral" | "Mixed",
          "Positive": float (e.g., 0.85),
          "Negative": float (e.g., 0.05),
          "Neutral": float (e.g., 0.10),
          "Mixed": float (e.g., 0.00)
        }
        
        Make sure the response is a valid JSON. Do not include any explanations or formatting for markdown. 
        
        Return ONLY the JSON object, nothing else.`,
      },
    ],
    temperature: 0.7,
    max_tokens: -1,
    stream: false,
  };
}
