import express, { Express } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/db";
import { exerciseRoute } from "./routes/exercise";
import { userRoute } from "./routes/user";
import { Workout } from "./models/workout";
import { User } from "./models/user";
import { workoutRoute } from "./routes/workout";
import { UserExercise } from "./models/userExercise";
import { Schedule } from "./models/schedule";
import session from "express-session";
import { Sequelize } from "sequelize";
import SequelizeStore from "connect-session-sequelize";
import "./services/scheduler";

dotenv.config();

const SequelizeSessionStore = SequelizeStore(session.Store);
const store = new SequelizeSessionStore({
  db: dbConnect, // your Sequelize database connection
});

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

app.use(
  session({
    secret: "&hdh832&*",
    resave: false,
    saveUninitialized: true,
    store,
    cookie: { secure: false, maxAge: 2 * 60 * 1000 }, // 1 day
  }),
);
// ** Finally, we set the secure option to true to ensure that the session cookie is only sent over HTTPS.
store.sync();

// Define routes
app.use("/exercise", exerciseRoute);
app.use("/user", userRoute);
app.use("/workout", workoutRoute);

// Define associations
Workout.belongsTo(User);
User.hasMany(Workout);
Workout.hasMany(UserExercise, { onDelete: "CASCADE" });
UserExercise.belongsTo(Workout, { onDelete: "CASCADE" });
UserExercise.belongsTo(User, { foreignKey: "userId" });
Workout.hasMany(Schedule, { foreignKey: "WorkoutId", onDelete: "CASCADE" });
Schedule.belongsTo(Workout, { foreignKey: "WorkoutId", onDelete: "CASCADE" });
//! With onDelete: 'CASCADE', when you delete a Workout, it should automatically delete the associated UserExercise records.

// Sync database and start the server
dbConnect.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
});
