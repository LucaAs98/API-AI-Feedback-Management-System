import { Request, Response } from 'express'; // Assuming you're using Express
import { errorMessages } from './prismaErrorCodes';
import { Prisma } from '../../prisma/generated';

/**
 * Extracts and returns a user-friendly error message from a Prisma error.
 *
 * @param {any} error - The error object to extract the message from.
 * @returns {string} - A user-friendly error message related to the Prisma error.
 */
export function getPrismaError(error: any): string {
  //Checks if the provided error is a known PrismaClientKnownRequestError
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return errorMessages[error.code] || 'An unknown PRISMA error occurred.';
  }
  //If the error is not a known Prisma error, it attempts to extract the message, retrieving the last line of the error
  return error.message.split('\n').pop() || 'Unknown error occurred.';
}

/**
 * Validates the request body to ensure that the specified fields are present.
 *
 * @param {Request} req - The request object containing the body to validate.
 * @param {Response} res - The response object to send the validation result.
 * @param {string[]} requiredFieldNames - An array of field names that are required in the request body.
 * @returns {null|Response} - Returns null if validation passes; otherwise, sends a 422 response with a message.
 */
export const validateRequestBody = (req: Request, res: Response, requiredFieldNames: string[]): null | Response => {
  // Filter out the fields that are missing from the request body
  const missingFields = requiredFieldNames.filter((field) => !req.body[field]);

  // If there are any missing fields, send a response with the error message
  if (missingFields.length > 0) {
    const fieldList = missingFields.join(', ');
    const fieldCount = missingFields.length;
    const fieldWord = fieldCount > 1 ? 'Fields' : 'Field'; // Determine singular/plural
    const verb = fieldCount > 1 ? 'are' : 'is'; // Determine verb form

    return res.status(422).json({ message: `${fieldWord} ${fieldList} ${verb} required.` });
  }

  return null; //No errors
};
