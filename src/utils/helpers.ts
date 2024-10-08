import { Prisma } from '@prisma/client';
import { errorMessages } from './prismaErrorCodes';

export function getPrismaError(error: any): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return errorMessages[error.code] || 'An unknown PRISMA error occurred.';
  }
  return error.message.split('\n').pop() || 'Unknown error occurred.';
}
