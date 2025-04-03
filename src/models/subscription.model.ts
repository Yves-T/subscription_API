import mongoose, { Schema } from "mongoose";

interface Subscription {
  name: string;
  price: number;
  currency: string;
  frequency: string;
  category: string;
  paymentMethod: string;
  status: string;
  startDate: Date;
  renewalDate: Date;
  user: Schema.Types.ObjectId;
}

const subscriptionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enun: ["USD", "EUR", "GBP"],
      default: "EUR",
    },
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"] },
    category: {
      type: String,
      required: true,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
    },
    paymentMethod: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (this: Subscription, value: Date) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  // auto recalculate auto renewal date if missing
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    const frequency = this.frequency ? renewalPeriods[this.frequency] : 0;
    this.renewalDate.setDate(this.renewalDate.getDate() + frequency);
  }

  // auto update the statusif renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

export default mongoose.model<Subscription>("Subscription", subscriptionSchema);
