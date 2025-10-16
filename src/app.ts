import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error";
import health from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import orgRoutes from "./routes/org.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", health);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);

app.use(errorHandler);

export default app;
