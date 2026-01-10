import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../middlewares/errorHandler";
import { orderModel } from "../models/orderModel";

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  var user = await userModel.findOne({ email });

  if (user) {
    throw new AppError("user already exists!", 400);
  }

  var hashedPassword = await bcrypt.hash(password, 10);
  user = new userModel({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });
  await user.save();
  return {
    data: generateToken({ firstName, lastName, email }),
    statusCode: 201,
  };
};

interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 400);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Password is incorrect", 400);
  }

  return {
    data: generateToken({
      firstName: user.firstName,
      lastName: user.lastName,
      email,
    }),
    statusCode: 200,
  };
};

interface GetMyOrdersParams {
  userId: string;
}

export const getMyOrders = async ({ userId }: GetMyOrdersParams) => {
  const orders = await orderModel.find({ userId });
  return { data: orders, statusCode: 200 };
};

const generateToken = (payloadData: any) => {
  return jwt.sign(payloadData, process.env.JWT_SECRET || "", {
    expiresIn: "24h",
  });
};
