import { Prisma, PrismaClient, user as User } from '@prisma/client';
import { getPrismaError } from '../utils/helpers';
import bcrypt from 'bcrypt';

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Fetches all users from the database.
 *
 * @returns {Promise<Prisma.user[]>} - A promise that resolves to an array of users.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    const errorMessage = getPrismaError(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Creates a new user in the database.
 *
 * @param {Prisma.userCreateInput} data - An object containing user data.
 * @returns {Promise<Prisma.user>} - A promise that resolves to the created user.
 * @throws {Error} - Throws an error if the creation operation fails.
 */
export const createUser = async (data: UserCreationInput): Promise<User> => {
  const { password, ...dataAux } = data; //Remove password field
  try {
    const completeUser: Prisma.userCreateInput = {
      ...dataAux,
      password_hash: await bcrypt.hash(password, 10),
    };
    return await prisma.user.create({ data: completeUser });
  } catch (error) {
    const errorMessage = getPrismaError(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

type UserCreationInput = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};
