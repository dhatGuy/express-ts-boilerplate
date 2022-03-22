import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorMiddleware } from "./middleware/error.middleware.";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";

const app = express();

app.use(loggerMiddleware);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorMiddleware);
app.use(notFoundMiddleware);

export default app;
