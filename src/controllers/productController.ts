// src/controllers/productController.ts
import { Request, Response } from 'express';
import { createProduct, getProductById, getProductsByType } from '../services/productService';
import { validateRequestBody } from '../utils/helpers';
import { ProductType } from '@prisma/client';

/**
 * Retrieves a product by its ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const retrieveProductById = async (req: Request, res: Response): Promise<void> => {
  const productId = Number(req.params.id); // Extract product ID from the request parameters

  try {
    const product = await getProductById(productId); // Call the service to get the product

    if (!product) {
      // If no product found, respond with 404
      res.status(404).json({
        message: 'Product not found.',
      });
      return;
    }

    res.json(product); // Respond with the product details
  } catch (error) {
    res.status(500).json({
      message: `Error while retrieving the product: ${error.message}`,
    });
  }
};

/**
 * Retrieves all the products of a specific type.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const retrieveProductsByType = async (req: Request, res: Response): Promise<void> => {
  const productType = req.params.type; // Extract product ID from the request parameters

  try {
    const products = await getProductsByType(productType); // Call the service to get the product

    res.json(products); // Respond with the product details
  } catch (error) {
    res.status(500).json({
      message: `Error while retrieving the products of type "${productType}: ${error.message}`,
    });
  }
};

/**
 * Adds a new product to the database.
 *
 * @param {Request} req - The request object containing product data.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body
    let fieldsToValidate = ['title', 'image', 'type', 'genre_category'];
    fieldsToValidate.concat(getSpecificFieldsToValidate(req.body.type));

    const validationError = validateRequestBody(req, res, fieldsToValidate);
    if (validationError) return;

    // Create a new product entry in the database and send the response
    const response = await createProduct(req.body);

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: `Error while adding an product: ${error.message}` });
  }
};

/**
 * Retrieves an array of specific fields to validate based on the product type.
 *
 * @param {ProductType} type - The type of product for which to retrieve the validation fields.
 * @returns {string[]} An array of field names that should be validated for the specified product type. Returns an empty array if the product type is not recognized.
 */
function getSpecificFieldsToValidate(type: ProductType): string[] {
  switch (type) {
    case ProductType.FILM:
      return ['director', 'duration', 'description'];
    case ProductType.BOOK:
      return ['publisher', 'author', 'isbn', 'description'];
    case ProductType.MUSIC:
      return ['producer', 'artist', 'duration'];
    default:
      return [];
  }
}
