import { getUser, getUsers } from "@controllers/user.controller";
import authorize from "@middlewares/auth.middleware";
import express, { Request, Response } from "express";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req: Request, res: Response) => {
  res.send({ title: "CREATE new user" });
});

userRouter.put("/:id", (req: Request, res: Response) => {
  res.send({ title: "UPDATE user" });
});

userRouter.delete("/:id", (req: Request, res: Response) => {
  res.send({ title: "DELETE user" });
});

export default userRouter;
