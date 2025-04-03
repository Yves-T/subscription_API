import { ArcjetNodeRequest } from "@arcjet/node";
import { aj } from "@config/arcjet";
import { NextFunction, Request, Response } from "express";

const arcJetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decission = await aj.protect(req as unknown as ArcjetNodeRequest, {
      requested: 1,
    });

    if (decission.isDenied()) {
      if (decission.reason.isRateLimit()) {
        res.status(409).json({ error: "Rate limit exceeded" });
        return;
      }

      if (decission.reason.isBot()) {
        res.status(403).json({ error: "Bot detected" });
        return;
      }
      res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch (error) {
    console.log(`Arcjet middleware error: ${error}`);
    next(error);
  }
};

export default arcJetMiddleware;
