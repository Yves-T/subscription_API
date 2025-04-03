# subscription API

API for managing subscriptions

## Core Functionalities:

User Subscription Input Users can input subscription details: name, price, frequency, renewal date, and category.

Payment Reminders Schedule reminders for upcoming renewals using Upstash workflows.

Upcoming Renewals Fetch subscriptions sorted by the next renewal date.

Secure User Authentication Implement user registration, login, and JWT-based authentication.

## Upstash workflow

- Triggering the Workflow

      - The workflow begins whenever a user creates or submits a new subscription. We pass the created subscription ID to our workflow.

- Retrieving Subscription Details

      - The process extracts the subscription ID from the context.
      - It then searches for the corresponding subscription in the database.

- Validation Checks

      - If the subscription does not exist, an error is logged, and the process terminates.
      - If the subscription exists, its status is checked:
      		- If inactive, the status is logged, and the process exits.
      		- If active, the reneWal date is verified.

- Renewal Date Evaluation

      - If the renewal date has passed, it logs this information and exits.
      - If the renewal date is in the future, the reminder loop begins.

- Reminder Scheduling

      - For each predefined reminder:
      			- The reminder date is calculated.
      			- If the reminder date is in the future, the system waits until that time.
      			- Once the reminder date arrives (or if it has already passed), the reminder email is sent.

- Completion

      - The process repeats for all reminders in the list.
      - After processing all reminders, the workflow concludes.

## How to start local development with upstash

See [official docs](https://upstash.com/docs/qstash/howto/local-development)

- Start the server with `npx @upstash/qstash-cli dev`
- Copy & paste environment variables in your `.env` file.

Test the workflow: create a subscription by sending a POST request to `api/v1/subscription/` with a JSON body

```json
{
  "name": "Elite Membership",
  "price": 101,
  "currency": "EUR",
  "frequency": "monthly",
  "category": "entertainment",
  "startDate": "2025-04-01T00:00:00.000Z",
  "paymentMethod": "Credit Card"
}
```
