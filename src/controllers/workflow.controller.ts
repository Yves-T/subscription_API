import Subscription from "@models/subscription.model";
import { WorkflowContext } from "@upstash/workflow";
import { serve } from "@upstash/workflow/express";
import dayjs from "dayjs";

interface SubscriptionWorkFLow {
  subscriptionId: string;
}

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(
  async (context: WorkflowContext<SubscriptionWorkFLow>) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== "active") {
      // subscription not active = exit early
      return;
    }

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
      console.log(
        `Renewal date has passed for subscriptin ${subscriptionId}. Stopping workflow`
      );
      return;
    }

    // it is an active subsription = iterate over all reminders
    for (const daysBefore of REMINDERS) {
      const reminderDate = renewalDate.subtract(daysBefore, "day");

      if (reminderDate.isAfter(dayjs())) {
        await sleepUntilReminder(
          context,
          `Reminder ${daysBefore} days before`,
          reminderDate
        );
      }

      await triggerReminder(context, `Reminder ${daysBefore} days before`);
    }
  }
);

const fetchSubscription = async (
  context: WorkflowContext<SubscriptionWorkFLow>,
  subscriptionId: string
) => {
  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "name email"
    );
  });
};

const sleepUntilReminder = async (
  context: WorkflowContext<SubscriptionWorkFLow>,
  label: string,
  date: dayjs.Dayjs
) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (
  context: WorkflowContext<SubscriptionWorkFLow>,
  label: string
) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder`);
    // send email , SMS , push notifications ...
  });
};
