import { Request, Response } from 'express';
import { getAverageFeedbackScoreByProductId, ProductStatistics } from '../services/statistic.service';

/**
 * Retrieves statistics for a product by its ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const retrieveProductStatistics = async (req: Request, res: Response): Promise<void> => {
  console.log('Request: ', req.url);

  const productId = Number(req.params.id); // Extract product ID from the request parameters

  try {
    const statistics: ProductStatistics = {
      averageScore: 0,
      significantSummary: '',
    };

    statistics.averageScore = await getAverageFeedbackScoreByProductId(productId);

    if (statistics.averageScore === null) {
      // If no statistics found, respond with 404
      res.status(404).json({
        message: 'Statistics not found for the specified product.',
      });
      return;
    }

    res.json(statistics); // Respond with the product statistics
  } catch (error) {
    res.status(500).json({
      message: `Error while retrieving product statistics: ${error.message}`,
    });
  }
};
