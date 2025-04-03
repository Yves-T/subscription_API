import {
  createSubscription,
  getUserSubscriptions,
} from "@controllers/subscription.controller";
import authorize from "@middlewares/auth.middleware";
import express, { Request, Response } from "express";

const subscriptionRouter = express.Router();

subscriptionRouter.get("/", (req: Request, res: Response) => {
  res.send({ title: "GET all subscriptions" });
});

subscriptionRouter.get("/:id", (req: Request, res: Response) => {
  res.send({ title: "GET subscription details" });
});

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req: Request, res: Response) => {
  res.send({ title: "UPDATE subscription" });
});

subscriptionRouter.delete("/:id", (req: Request, res: Response) => {
  res.send({ title: "DELETE subscription" });
});

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", (req: Request, res: Response) => {
  res.send({ title: "CANCEL user subscription" });
});

subscriptionRouter.get("/upcomming-renewals", (req: Request, res: Response) => {
  res.send({ title: "GET upcomming renewals" });
});

export default subscriptionRouter;
