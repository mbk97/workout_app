import { User } from "../models/user";
import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  const payload = {
    username,
    email,
    password,
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

export { createUser };
