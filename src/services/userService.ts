import userModel from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async ({ firstName, lastName, email, password } : RegisterParams) => {
  var user = await userModel.findOne({ email });

  if (user) {
    return {data: "user already exists!", statusCode: 400};
  }

  var hashedPassword = await bcrypt.hash(password, 10);
  user = new userModel({ email, password: hashedPassword, firstName, lastName });
  await user.save();
  return {data: generateToken({firstName, lastName, email}), statusCode: 201};
};

interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password } : LoginParams) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    return {data: "invalid credentials! incorrect email or password", statusCode: 400};
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return {data: "invalid credentials! incorrect email or password", statusCode: 400};
  }
  
  return {data: generateToken({firstName: user.firstName, lastName: user.lastName, email}), statusCode: 200};
}

const generateToken = (payloadData: any) => {
  const jwt_secret_key = "QeIYQEWweBKu5sSCSrHxjwvVpGaZI65O";
  return jwt.sign(payloadData, "jwt_secret_key", { expiresIn: '24h' });
}
