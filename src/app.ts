import cors from "cors";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from "./middleware/error.middleware.";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { RegisterRoutes } from "./routes";
import swaggerJson from "./swagger.json";
import logger from "./utils/logger";

const app = express();

app.use(loggerMiddleware);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));
} catch (err) {
  logger.error("Unable to read swagger.json", err);
}

RegisterRoutes(app);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
