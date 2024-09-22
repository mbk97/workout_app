import { Router } from "express";
import { getAllExercises } from "../controller/exercise";

const exerciseRoute = Router();

exerciseRoute.get("/", getAllExercises);

export { exerciseRoute };
