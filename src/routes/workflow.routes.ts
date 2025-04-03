import { sendReminders } from "@controllers/workflow.controller";
import express from "express";

const workFlowRouter = express.Router();

workFlowRouter.post("/subscription/reminder", sendReminders);

export default workFlowRouter;
