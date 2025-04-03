import { connect, ConnectOptions } from "mongoose";

const dbName = "subscription";
const options: ConnectOptions = {
  dbName,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

export const dbConnect = async () => {
  try {
    await connect(process.env.MONGO_URI!, options);
    console.log("Mongo DB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
