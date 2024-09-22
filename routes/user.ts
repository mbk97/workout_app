import { Router } from "express";
import { createUser } from "../controller/user";

const userRoute = Router();

userRoute.post("/", createUser);

export { userRoute };
