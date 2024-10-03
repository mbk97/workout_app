import express, { Express, Request, Response } from "express";

const isAuthenticated = async (req: Request, res: Response, next: Function) => {
  if ((req.session as any).userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export { isAuthenticated };
