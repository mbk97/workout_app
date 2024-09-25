import { Router } from "express";
import { createUser, loginUser } from "../controller/user";

const userRoute = Router();

userRoute.post("/create", createUser);
userRoute.post("/login", loginUser);

export { userRoute };
