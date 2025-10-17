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
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import interviewRoutes from "./routes/interview.routes";
import messageRoutes from "./routes/message.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", health);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

export default app;
