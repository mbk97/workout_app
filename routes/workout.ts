import { Router } from "express";
import {
  createWorkout,
  deleteWorkout,
  getAllUserWorkout,
  getPendingWorkouts,
  scheduleWorkout,
  updateWorkout,
} from "../controller/workout";

const workoutRoute = Router();

workoutRoute.post("/", createWorkout);
workoutRoute.get("/", getAllUserWorkout);
workoutRoute.put("/:workoutId", updateWorkout);
workoutRoute.delete("/:workoutId", deleteWorkout);
workoutRoute.post("/schedule", scheduleWorkout);
workoutRoute.get("/pending", getPendingWorkouts);

export { workoutRoute };
