import cron from "node-cron";
import { sendEmail } from "./email";
import { Schedule } from "../models/schedule";
import { User } from "../models/user";
import { Op } from "sequelize";

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
  const tenMinutesLater = new Date(currentDateTime);
  tenMinutesLater.setMinutes(currentDateTime.getMinutes() + 10); // 10 minutes later

  try {
    const upcomingWorkouts = await Schedule.findAll({
      where: {
        workoutDate: currentDateTime.toISOString().split("T")[0], // Match today's date
        workoutTime: {
          [Op.between]: [
            currentDateTime.toTimeString().substring(0, 5), // Current time
            tenMinutesLater.toTimeString().substring(0, 5), // 10 minutes from now
          ],
        },
      },
    });

    // Send emails for each upcoming workout
    upcomingWorkouts.forEach(async (workout) => {
      try {
        const userEmail = await getUserEmail(workout.username); // Get user's email
        if (userEmail) {
          const subject = "Workout Reminder";
          const text = `Don't forget your workout scheduled for today at ${workout.workoutTime}.`;

          await sendEmail(userEmail, subject, text);
          console.log(
            `Email sent to ${userEmail} for workout at ${workout.workoutTime}`,
          );
        }
      } catch (emailError) {
        console.error(
          `Failed to send email for workout ${workout.id}:`,
          emailError,
        );
      }
    });
  } catch (error) {
    console.error("Error retrieving upcoming workouts:", error);
  }
});
