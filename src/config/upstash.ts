import { Client as WorkflowClient } from "@upstash/workflow";

const baseUrl = process.env.QSTASH_URL!;
const token = process.env.QSTASH_TOKEN!;

export const workflowClient = new WorkflowClient({ baseUrl, token });
