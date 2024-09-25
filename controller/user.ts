import { User } from "../models/user";
import { Request, Response } from "express";
import {
  userLoginSchema,
  userRegistrationSchema,
  validate,
} from "../utils/validation";
import { compare, genSalt, hash } from "bcryptjs";
import { generateToken } from "../utils/token";

const createUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const error = validate(userRegistrationSchema, req.body);

  if (error) {
    res.status(400).json({
      message: error,
    });

    return;
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  const existingUsername = await User.findOne({ where: { username } });

  if (existingUsername) {
    res.status(400).json({
      message: "Username already exists",
    });

    return;
  }
  const payload = {
    username,
    email,
    password: hashedPassword,
  };

  try {
    const user = await User.create(payload);
    res.status(201).json({
      message: "New user created",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const error = validate(userLoginSchema, req.body);

  if (error) {
    res.status(400).json({
      message: error,
    });
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id.toString());
    if (!token) {
      console.log("Token generation failed");
      return res.status(500).json({ message: "Token generation error" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};

export { createUser, loginUser };
