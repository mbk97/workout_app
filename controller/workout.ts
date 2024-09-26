import { Request, Response } from "express";
import { User } from "../models/user";
import { Workout } from "../models/workout";
import { UserExercise } from "../models/userExercise";

const createWorkout = async (req: Request, res: Response) => {
  const { userId, exercises, date } = req.body;

  // Validate input
  if (!userId || !date || !exercises || !Array.isArray(exercises)) {
    res.status(400).json({
      message:
        "Invalid input. Make sure to provide userId, date, and a list of exercises.",
    });
    return;
  }

  // ! Remove the hard coded user
  const testUser = await User.findAll();
  const workoutDate = new Date(date);

  const workout = await Workout.create({
    date: workoutDate,
    UserId: testUser[0].id,
  });

  if (!workout) {
    return res.status(400).json({
      message: "Failed to create workout",
    });
    return;
  }

  const newExercise = await UserExercise.bulkCreate(
    exercises.map((exercise) => ({
      workoutId: workout.workoutId,
      nameOfUserExercise: exercise.nameOfUserExercise,
      numberOfSets: exercise.numberOfSets,
      numberOfRepetitions: exercise.numberOfRepetitions,
      weight: exercise.weight || null,
      userId: 1,
    })),
  );

  // Ensure that only necessary fields are returned
  const formattedWorkout = {
    workoutId: workout.workoutId,
    date: workout.date,
  };

  const formattedExercises = newExercise.map((exercise) => ({
    exerciseId: exercise.exerciseId,
    workoutId: exercise.workoutId,
    nameOfUserExercise: exercise.nameOfUserExercise,
    numberOfSets: exercise.numberOfSets,
    numberOfRepetitions: exercise.numberOfRepetitions,
    weight: exercise.weight,
  }));

  res.status(201).json({
    message: "Workout created successfully",
    data: {
      workout: formattedWorkout,
      exercises: formattedExercises,
    },
  });
};

const getAllUserWorkout = async (req: Request, res: Response) => {
  const { id } = req.body;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    res.status(400).json({
      message: "User not found!",
    });
    return;
  }
};

export { createWorkout, getAllUserWorkout };
