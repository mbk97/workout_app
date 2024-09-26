import { Router } from "express";
import { createWorkout, getAllUserWorkout } from "../controller/workout";

const workoutRoute = Router();

workoutRoute.post("/", createWorkout);
workoutRoute.get("/", getAllUserWorkout);

export { workoutRoute };
