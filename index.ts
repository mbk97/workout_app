import express, { Express } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/db";
import { exerciseRoute } from "./routes/exercise";
import { userRoute } from "./routes/user";
import { Workout } from "./models/workout";
import { User } from "./models/user";
import { workoutRoute } from "./routes/workout";
import { UserExercise } from "./models/userExercise";

dotenv.config();

// Database authentication
dbConnect
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Unable to connect to the database:", err));

// Initialize express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.use("/exercise", exerciseRoute);
app.use("/user", userRoute);
app.use("/workout", workoutRoute);

// Define associations
Workout.belongsTo(User);
User.hasMany(Workout);
Workout.hasMany(UserExercise);
UserExercise.belongsTo(Workout);

// Sync database and start the server
dbConnect.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
});
