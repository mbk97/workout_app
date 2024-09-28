import { DataTypes, Model, Optional } from "sequelize";
import { dbConnect } from "../config/db";
import { User } from "./user";

interface IWorkout {
  id: number;
  UserId: number;
  username: string;
  date: Date;
  completed: boolean;
}

interface WorkoutCreationAttributes extends Optional<IWorkout, "id"> {}

class Workout
  extends Model<IWorkout, WorkoutCreationAttributes>
  implements IWorkout
{
  public id!: number;
  public UserId!: number;
  public username!: string;
  public date!: Date;
  public completed!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Workout model
Workout.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
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
