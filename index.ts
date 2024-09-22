import express, { Express } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/db";
import { exerciseRoute } from "./routes/exercise";
import { userRoute } from "./routes/user";

dotenv.config();
dbConnect
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Unable to connect to the database:", err));

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/exercise", exerciseRoute);
app.use("/user", userRoute);

dbConnect.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
  });
});
