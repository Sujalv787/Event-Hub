import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function startServer() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`EventHub API running on port ${env.port}`);
  });
}

startServer();
