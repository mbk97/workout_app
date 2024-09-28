import { Router } from "express";
import { createUser, getAllUsers, loginUser } from "../controller/user";

const userRoute = Router();

userRoute.post("/create", createUser);
userRoute.post("/login", loginUser);
userRoute.get("/", getAllUsers);

export { userRoute };
