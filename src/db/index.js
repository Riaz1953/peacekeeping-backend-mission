import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // DNS রিগ্রেসিভ ফিক্স

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `\n MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("MONGODB Connection Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
