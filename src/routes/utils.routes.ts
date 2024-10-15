import express from 'express';
import { createBaseDB } from '../controllers/utils.controller';

const router = express.Router();

router.post('/utils/create-base-db', createBaseDB);

export default router;
