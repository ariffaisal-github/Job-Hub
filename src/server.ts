import app from "./app";
import { env } from "./utils/env";

const port = Number(env.PORT);
const server = app.listen(port, () => console.log(`🚀 Server on :${port}`));

process.on("SIGTERM", () => {
  console.log("Shutting down...");
  server.close(() => process.exit(0));
});
