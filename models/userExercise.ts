import { DataTypes, Model, Optional } from "sequelize";
import { dbConnect } from "../config/db";
import { Workout } from "./workout";

interface IUserExercise {
  id: number;
  userId: number;
  nameOfUserExercise: string;
  numberOfSets: number;
  numberOfRepetitions: number;
  weight?: number;
  WorkoutId?: number;
  completed: boolean;
}

interface UserExerciseCreationAttributes
  extends Optional<IUserExercise, "id"> {}

class UserExercise
  extends Model<IUserExercise, UserExerciseCreationAttributes>
  implements IUserExercise
{
  public id!: number;
  public userId!: number;
  public WorkoutId!: number;
  public nameOfUserExercise!: string;
  public numberOfSets!: number;
  public numberOfRepetitions!: number;
  public completed!: boolean;
  public weight?: number;
}

UserExercise.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
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
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnect,
    modelName: "UserExercise",
    tableName: "userexercise",
    timestamps: true,
  },
);

export { UserExercise };
