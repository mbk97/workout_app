import { Router } from "express";
import {
  createWorkout,
  deleteWorkout,
  getAllUserWorkout,
  updateWorkout,
} from "../controller/workout";

const workoutRoute = Router();

workoutRoute.post("/", createWorkout);
workoutRoute.get("/", getAllUserWorkout);
workoutRoute.put("/:workoutId", updateWorkout);
workoutRoute.delete("/:workoutId", deleteWorkout);

export { workoutRoute };
