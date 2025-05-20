import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const registerControllers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAvatarImageSet: user.isAvatarImageSet,
        avatarImage: user.avatarImage,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginControllers = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Select password explicitly because schema excludes it by default
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAvatarImageSet: user.isAvatarImageSet,
        avatarImage: user.avatarImage,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setAvatarController = async (req, res) => {
  try {
    const userId = req.params.id;
    const { avatarImage } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatarImage = avatarImage;
    user.isAvatarImageSet = true;
    await user.save();

    res.status(200).json({
      isSet: user.isAvatarImageSet,
      image: user.avatarImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
