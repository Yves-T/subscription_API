import express from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/sign-out", signOut);

export default authRouter;
