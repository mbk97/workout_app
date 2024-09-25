import { Request, Response } from "express";
import { Exercise } from "../models/exercises";

const getAllExercises = async (req: Request, res: Response) => {
  try {
    const response = await Exercise.findAll();
    console.log(response);
    res.json(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { getAllExercises };
