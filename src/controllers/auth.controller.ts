import User from "@models/user.model";
import { UserConflictError } from "@shared/errors/ConflictError";
import { ValidationError } from "@shared/errors/ValidationError";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRE = "1d";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  await session.startTransaction();

  // logic to create a new user
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new UserConflictError("User already exists"));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create(
    [
      {
        email,
        name,
        password: hashedPassword,
      },
    ],
    { session }
  );
  const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });

  await session.commitTransaction();
  await session.endSession();

  res.status(201).json({
    success: true,
    message: "User created Successfully",
    data: { token, user: newUser[0] },
  });
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ValidationError("Invalid credentials"));
  }
  const isUserValid = await bcrypt.compare(password, user.password);

  if (!isUserValid) {
    return next(new ValidationError("Invalid credentials"));
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
  res.status(200).json({
    success: true,
    message: "User created Successfully",
    data: { token, user },
  });
};

export const signOut = async (req, res, next) => {};
