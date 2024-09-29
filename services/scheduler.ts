import cron from "node-cron";
import { sendEmail } from "./email";
import { Schedule } from "../models/schedule";
import { User } from "../models/user";

const getUserEmail = async (username: string) => {
  const user = await User.findOne({
    where: {
      username,
    },
  });

  return user ? user.email : null;
};

// ! This schedules a task to run every minute
cron.schedule("* * * * *", async () => {
  const currentDateTime = new Date();
  currentDateTime.setMinutes(currentDateTime.getMinutes()); // Add 10 minutes
  //   currentDateTime.setMinutes(currentDateTime.getMinutes() + 10); // Add 10 minutes

  const upcomingWorkouts = await Schedule.findAll({
    where: {
      workoutDate: currentDateTime.toISOString().split("T")[0], // Match date
      workoutTime: currentDateTime.toTimeString().substring(0, 5), // Match time (HH:mm)
    },
  });

  upcomingWorkouts.forEach(async (workout) => {
    const userEmail = await getUserEmail(workout.username); // Implement this function to get user's email
    if (userEmail) {
      const subject = "Workout Reminder";
      const text = `Don't forget your workout scheduled for today at ${workout.workoutTime}.`;

      await sendEmail("oyindamola850@gmail.com", subject, text);
    }
  });
});
