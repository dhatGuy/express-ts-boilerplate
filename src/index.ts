import * as dotenv from "dotenv";
import app from "./app";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT, 10);

app.listen(PORT, () => {
  console.log(`✨ Magic happening on port ${PORT} ✨`);
});
