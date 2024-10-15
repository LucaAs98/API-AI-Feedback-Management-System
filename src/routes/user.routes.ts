import express from 'express';
import { getAllUsers, addUser } from '../controllers/user.controller';

const router = express.Router();

/**
 * GET /user
 * Retrieves a list of all users in the system.
 */
router.get('/user', getAllUsers);

/**
 * POST /user
 * Allows the creation of a new user.
 * This route expects a request body containing user details: "email", "password", "first_name", "last_name".
 */
router.post('/user', addUser);
export default router;
