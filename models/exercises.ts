import { DataTypes } from "sequelize";
import { dbConnect } from "../config/db";

const Exercise = dbConnect.define(
  "exercises",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    muscle_group: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
  },
  {
    timestamps: false, // Disable automatic timestamps
  },
);

export { Exercise };
