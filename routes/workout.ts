import { Router } from "express";
import {
  createWorkout,
  deleteWorkout,
  getAllUserWorkout,
  getPendingWorkouts,
  scheduleWorkout,
  updateWorkout,
} from "../controller/workout";
import { isAuthenticated } from "../utils/protect";

const workoutRoute = Router();

workoutRoute.post("/", isAuthenticated, createWorkout);
workoutRoute.get("/", isAuthenticated, getAllUserWorkout);
workoutRoute.put("/:workoutId", isAuthenticated, updateWorkout);
workoutRoute.delete("/:workoutId", isAuthenticated, deleteWorkout);
workoutRoute.post("/schedule", isAuthenticated, scheduleWorkout);
workoutRoute.get("/pending", isAuthenticated, getPendingWorkouts);

export { workoutRoute };
