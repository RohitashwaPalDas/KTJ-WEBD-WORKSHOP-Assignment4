import express from 'express'
import { getSummary } from '../controllers/summaeryController.js';
import authUser from '../middlewares/authUser.js';

const summaryRouter = express.Router();

summaryRouter.post("/get-summary", authUser, getSummary);

export default summaryRouter;