// src/controllers/userController.ts
import { Request, Response } from 'express';
import { getUsers, createUser } from '../services/userService';
import { Prisma } from '@prisma/client';

/**
 * Fetches all users from the database.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error while retrieving all the users: ${error.message}`,
      });
  }
};

/**
 * Adds a new user to the database.
 *
 * @param {Request} req - The request object containing user data.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await createUser(req.body);
    res.status(201).json(response);
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error while adding an user: ${error.message}` });
  }
};
