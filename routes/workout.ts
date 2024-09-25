import { Router } from "express";
import { createWorkout } from "../controller/workout";

const workoutRoute = Router();

workoutRoute.post("/", createWorkout);

export { workoutRoute };
