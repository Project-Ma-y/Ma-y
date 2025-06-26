import { Request, Response } from "express";

export const registerBooking = (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the landing page!",
  });
};
