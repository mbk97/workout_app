import { DataTypes } from "sequelize";
import { dbConnect } from "../config/db";

const User = dbConnect.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
});

export { User };
