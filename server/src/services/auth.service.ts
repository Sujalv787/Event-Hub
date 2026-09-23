import { User, IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

function buildAuthResponse(user: IUser) {
  const token = signToken({ id: user._id.toString(), role: user.role });
  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw ApiError.conflict("This email is already registered");
  }

  const user = await User.create(input);
  return buildAuthResponse(user);
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  return buildAuthResponse(user);
}
