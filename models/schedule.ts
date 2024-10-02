import { DataTypes, Model, Optional } from "sequelize";
import { dbConnect } from "../config/db";
import { User } from "./user";

interface ISchedule {
  id: number;
  WorkoutId: number;
  username: string;
  workoutDate: Date;
  workoutTime: string;
  emailSent?: boolean;
}

interface ScheduleCreationAttributes extends Optional<ISchedule, "id"> {}

class Schedule
  extends Model<ISchedule, ScheduleCreationAttributes>
  implements ISchedule
{
  public id!: number;
  public WorkoutId!: number;
  public username!: string;
  public workoutDate!: Date;
  public workoutTime!: string;
  public emailSent!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Schedule model
Schedule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    WorkoutId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workoutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    workoutTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: dbConnect,
    modelName: "Schedule",
    tableName: "schedule",
    timestamps: true,
  },
);

export { Schedule };
