import express from 'express'
import { logInUser, registerUser, userDetails } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", logInUser);
userRouter.post("/getuser", authUser, userDetails);

export default userRouter;