import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

import arcJetMiddleware from "@middlewares/arcjet.middleware";
import workFlowRouter from "@routes/workflow.routes";
import cookieParser from "cookie-parser";
import { dbConnect } from "./database/mongodb";
import errorMiddleware from "./middlewares/error.middleware";
import authRouter from "./routes/auth.routes";
import subscriptionRouter from "./routes/subscription.routes";
import userRouter from "./routes/user.routes";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(arcJetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/workflow", workFlowRouter);

app.use(errorMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to the subscription tracker API");
});

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  await dbConnect();
});
