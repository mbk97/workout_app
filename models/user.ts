import { DataTypes, Model, Optional } from "sequelize";
import { dbConnect } from "../config/db";

interface UserAttributes {
  id: number;
  email: string;
  username: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
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
  },
  {
    sequelize: dbConnect, // Pass the database connection
    modelName: "User",
    tableName: "users",
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

export { User };
