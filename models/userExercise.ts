import { DataTypes, Model, Optional } from "sequelize";
import { dbConnect } from "../config/db";
import { Workout } from "./workout";

interface IUserExercise {
  exerciseId: number;
  workoutId: number;
  nameOfUserExercise: string;
  numberOfSets: number;
  numberOfRepetitions: number;
  weight?: number;
}

interface UserExerciseCreationAttributes
  extends Optional<IUserExercise, "exerciseId"> {}

class UserExercise
  extends Model<IUserExercise, UserExerciseCreationAttributes>
  implements IUserExercise
{
  public exerciseId!: number;
  public workoutId!: number;
  public nameOfUserExercise!: string;
  public numberOfSets!: number;
  public numberOfRepetitions!: number;
  public weight?: number;
}

// Initialize the UserExercise model
UserExercise.init(
  {
    exerciseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    workoutId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nameOfUserExercise: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    numberOfSets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberOfRepetitions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnect,
    modelName: "UserExercise",
    tableName: "userExercise",
    timestamps: true,
  },
);

export { UserExercise };
