import * as dotenv from "dotenv";
import app from "./app";
import logger from "./utils/logger";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT, 10);

app.listen(PORT, () => {
  logger.info(`✨ Magic happening on port ${PORT} ✨`);
});
