import { Request, Response } from "express";
import { User } from "../models/user";
import { Exercise } from "../models/exercises";
import { Workout } from "../models/workout";
import { UserExercise } from "../models/userExercise";

const createWorkout = async (req: Request, res: Response) => {
  const { userId, exercises, date } = req.body;
  if (!userId || !date || !exercises || !Array.isArray(exercises)) {
    return res.status(400).json({
      message:
        "Invalid input. Make sure to provide userId, date, and an array of exercises.",
    });
  }
  const testUser = await User.findAll();

  const workout = await Workout.create({
    userId: testUser[0].id,
    date: new Date("2024-10-10"),
  });

  if (!workout) {
    res.status(400).json({
      message: "Failed to create workout",
    });
    return;
  }

  const newExercise = await UserExercise.bulkCreate(
    exercises.map((exercise) => {
      return {
        workoutId: workout.workoutId,
        nameOfUserExercise: exercise.nameOfUserExercise,
        numberOfSets: exercise.numberOfSets,
        numberOfRepetitions: exercise.numberOfRepetitions,
        weight: exercise.weight || null,
      };
    }),
  );
  if (newExercise) {
    res.status(201).json({
      message: "Workout created successfully",
      data: {
        ...workout,
        newExercise,
      },
    });
  }
};

export { createWorkout };
