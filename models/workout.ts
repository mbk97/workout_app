import { DataTypes, Model, Optional } from "sequelize";
import { dbConnect } from "../config/db";
import { User } from "./user";

interface IWorkout {
  workoutId: number;
  userId: number;
  date: Date;
}

interface WorkoutCreationAttributes extends Optional<IWorkout, "workoutId"> {}

class Workout
  extends Model<IWorkout, WorkoutCreationAttributes>
  implements IWorkout
{
  public workoutId!: number;
  public userId!: number;
  public date!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Workout model
Workout.init(
  {
    workoutId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnect,
    modelName: "Workout",
    tableName: "workouts",
    timestamps: true,
  },
);

export { Workout };
