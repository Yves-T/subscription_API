import { workflowClient } from "@config/upstash";
import Subscription from "@models/subscription.model";
import { UnAuthorizedError } from "@shared/errors/UnAuthorizedError";
import { NextFunction, Request, Response } from "express";

const SERVER_URL = process.env.SERVER_URL!;

export const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const subscription = await Subscription.create({
    ...req.body,
    user: req.user,
  });

  const { workflowRunId } = await workflowClient.trigger({
    url: `${SERVER_URL}/api/v1/workflow/subscription/reminder`,
    body: {
      subscriptionId: subscription._id.toString(),
    },
    headers: {
      "content-type": "application/json",
    },
    retries: 0,
  });

  res
    .status(201)
    .json({ success: true, data: { subscription, workflowRunId } });
};

export const getUserSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // is user the same as the one in the token
  if (req.user !== req.params.id) {
    return next(
      new UnAuthorizedError("You are not the owner of this account.")
    );
  }
  const subscriptions = await Subscription.find({
    user: req.user,
  });

  res.status(201).json({ success: true, data: subscriptions });
};
