import { Request, Response } from "express";
import { User } from "../models/user";
import { Workout } from "../models/workout";
import { UserExercise } from "../models/userExercise";
import { Schedule } from "../models/schedule";
import { scheduleWorkoutValidationSchema, validate } from "../utils/validation";
import { sendEmail } from "../services/email";
import { Op } from "sequelize";

const createWorkout = async (req: Request, res: Response) => {
  const { userId, exercises, date, username } = req.body;

  if (!userId || !date || !exercises || !Array.isArray(exercises)) {
    res.status(400).json({
      message:
        "Invalid input. Make sure to provide userId, date, and a list of exercises.",
    });
    return;
  }

  // ! Remove the hard coded user
  const testUser = await User.findOne({
    where: {
      id: userId,
    },
  });

  const workoutDate = new Date(date);

  if (username !== testUser.username) {
    res.status(400).json({
      message: "You are not authorized to create a workout for this user",
    });
    return;
  }
  const workout = await Workout.create({
    date: workoutDate,
    UserId: testUser.id,
    username: testUser.username,
    completed: false,
  });

  if (!workout) {
    return res.status(400).json({
      message: "Failed to create workout",
    });
    return;
  }

  const newExercise = await UserExercise.bulkCreate(
    exercises.map((exercise) => ({
      nameOfUserExercise: exercise.nameOfUserExercise,
      numberOfSets: exercise.numberOfSets,
      numberOfRepetitions: exercise.numberOfRepetitions,
      weight: exercise.weight || null,
      userId: testUser.id,
      completed: false,
      WorkoutId: workout.id,
    })),
  );

  const formattedExercises = newExercise.map((exercise) => ({
    exerciseId: exercise.id,
    nameOfUserExercise: exercise.nameOfUserExercise,
    numberOfSets: exercise.numberOfSets,
    numberOfRepetitions: exercise.numberOfRepetitions,
    weight: exercise.weight,
    userId: exercise.userId,
    workoutId: workout.id,
    completed: false,
  }));

  const formattedWorkout = {
    date: workout.date,
    userId: workout.UserId,
    completed: workout.completed,
    username: workout.username,
    workoutId: workout.id,
  };

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

  try {
    // Find the user by id
    const user = await User.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    // Find all workouts belonging to the user
    const workouts = await Workout.findAll({
      where: { UserId: user.id },
    });

    if (workouts.length === 0) {
      return res.status(200).json({
        message: "No workouts found for this user!",
        data: [],
      });
    }

    // Fetch exercises for each workout
    const exercisesUnderWorkouts = await Promise.all(
      workouts.map(async (workout) => {
        const exercises = await UserExercise.findAll({
          where: { WorkoutId: workout.id },
        });
        return {
          workout, // Include full workout object
          exercises, // List of exercises for this workout
        };
      }),
    );

    // Return each workout with its respective exercises
    return res.status(200).json({
      data: exercisesUnderWorkouts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching data.",
      error: error.message,
    });
  }
};

const updateWorkout = async (req: Request, res: Response) => {
  const workoutId = req.params.workoutId;
  const { userId, exercises, date, username } = req.body;
  let formattedWorkout;

  try {
    const workoutToBeUpdated = await Workout.findOne({
      where: {
        id: workoutId,
      },
    });

    if (!workoutToBeUpdated) {
      res.status(400).json({
        message: "Workout does not exist",
      });
      return;
    }

    if (!userId || !date || !exercises || !Array.isArray(exercises)) {
      res.status(400).json({
        message:
          "Invalid input. Make sure to provide userId, date, and a list of exercises.",
      });
      return;
    }

    // ! Remove the hard coded user
    const testUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    const workoutDate = new Date(date);

    if (username !== testUser.username) {
      res.status(400).json({
        message: "You are not authorized to update this workout",
      });
    }
    Workout.update(
      {
        date: workoutDate,
        UserId: testUser.id,
        username: testUser.username,
        completed: false,
      },
      {
        where: {
          id: workoutId, // Replace this with your workout's unique identifier
        },
      },
    );

    const newExercise = await UserExercise.bulkCreate(
      exercises.map(
        (exercise) => ({
          nameOfUserExercise: exercise.nameOfUserExercise,
          numberOfSets: exercise.numberOfSets,
          numberOfRepetitions: exercise.numberOfRepetitions,
          weight: exercise.weight || null,
          userId: testUser.id,
          completed: exercise.completed,
        }),
        {
          updateOnDuplicate: [
            "completed",
            "numberOfSets",
            "numberOfRepetitions",
            "weight",
          ],
        },
      ),
    );
    //  ! The bulkCreate uses updateOnDuplicate to allow updating existing exercises based on the provided fields.

    const allExercisesCompleted = newExercise.every(
      (exercise) => exercise.completed === true,
    );

    // If all exercises are completed, update the workout's completed field
    if (allExercisesCompleted) {
      await Workout.update({ completed: true }, { where: { id: workoutId } });
    }

    const updatedWorkout = await Workout.findOne({ where: { id: workoutId } });

    if (updatedWorkout) {
      formattedWorkout = {
        date: updatedWorkout.date,
        userId: updatedWorkout.UserId,
        completed: updatedWorkout.completed,
        workoutId: updatedWorkout.id,
        username: testUser.username,
      };
    }

    const formattedExercises = newExercise.map((exercise) => ({
      exerciseId: exercise.id,
      nameOfUserExercise: exercise.nameOfUserExercise,
      numberOfSets: exercise.numberOfSets,
      numberOfRepetitions: exercise.numberOfRepetitions,
      weight: exercise.weight,
      userId: exercise.userId,
      workoutId: updatedWorkout.id,
      completed: exercise.completed,
    }));

    res.status(201).json({
      message: "Workout updated successfully",
      data: {
        workout: formattedWorkout,
        exercises: formattedExercises,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteWorkout = async (req: Request, res: Response) => {
  const workoutId = req.params.workoutId;

  try {
    const workout = await Workout.findOne({
      where: { id: workoutId },
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    // Delete workout
    await Workout.destroy({ where: { id: workoutId } });

    // Delete related exercises
    await UserExercise.destroy({
      where: {
        WorkoutId: workoutId,
      },
    });

    // Respond with success
    return res.status(200).json({
      message: "Workout and related exercises deleted successfully",
    });
  } catch (error) {
    console.error(error); // For debugging purposes
    return res.status(500).json({
      message: "An error occurred while deleting the workout",
    });
  }
};

const scheduleWorkout = async (req: Request, res: Response) => {
  const { workoutTime, workoutDate, workoutId, username } = req.body;
  const error = validate(scheduleWorkoutValidationSchema, req.body);

  if (error) {
    res.status(400).json({
      message: error,
    });
    return;
  }

  try {
    const workout = await Workout.findOne({
      where: {
        id: workoutId,
        username: username,
      },
    });

    if (!workout) {
      res.status(400).json({
        message: "Workout does not exist",
      });
      return;
    }

    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(400).json({
        message: "User does not exist",
      });
      return;
    }
    const userDate = new Date(workoutDate);
    const currentDate = new Date();

    // Set currentDate's time to 00:00:00 for date-only comparison
    currentDate.setHours(0, 0, 0, 0);

    // Check if the workoutDate is in the past
    if (userDate < currentDate) {
      res.status(400).json({
        message: "Workout date cannot be in the past",
      });
      return;
    }

    // Validate workoutTime in 24-hour format (HH:mm)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(workoutTime)) {
      return res.status(400).json({
        message: "Invalid time format. Please use HH:mm (24-hour format).",
      });
    }

    // Check if the workoutDate is today and the workoutTime is in the past
    const isToday = userDate.toDateString() === currentDate.toDateString();

    if (isToday) {
      // Parse user workout time (HH:mm)
      const [hours, minutes] = workoutTime.split(":").map(Number); // Convert to numbers
      const userTime = new Date(userDate.setHours(hours, minutes, 0, 0)); // Set workout time to Date object

      // Get current time
      const currentTime = new Date();

      // Check if the workout time is in the past
      if (userTime < currentTime) {
        return res.status(400).json({
          message: "Workout time cannot be in the past",
        });
      }
    }

    const exercises = await UserExercise.findAll({
      where: {
        WorkoutId: workoutId,
      },
    });

    const scheduledWorkout = await Schedule.create({
      WorkoutId: workoutId,
      username: user.username,
      workoutTime: workoutTime,
      workoutDate: workoutDate,
    });

    if (scheduledWorkout) {
      const subject = "Workout Schedule";
      const html = `<html>hello ${user.username} <br /> You just scheduled a workout for ${workoutDate} by ${workoutTime}. <br />Ensure you remember to carry out this workout as planned</html>`;

      sendEmail(user.email, subject, "", html);
      res.status(201).json({
        message: "Workout scheduled successfully",
        data: {
          scheduledWorkout,
          exercises,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

const getPendingWorkouts = async (req: Request, res: Response) => {
  const currentDateTime = new Date();
  const { username } = req.body;

  // * Op.gt: This is Sequelize's operator for "greater than" (>). It ensures that only workouts whose time is later than the current time are returned.

  try {
    const upcomingWorkouts = await Schedule.findAll({
      where: {
        workoutTime: {
          [Op.gt]: currentDateTime.toTimeString().substring(0, 5),
        },
        username,
      },
    });

    res.status(200).json({
      message: `Upcoming workouts retrieved successfully for ${username}`,
      data: upcomingWorkouts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workouts", error });
  }
};

export {
  createWorkout,
  getAllUserWorkout,
  updateWorkout,
  deleteWorkout,
  scheduleWorkout,
  getPendingWorkouts,
};
