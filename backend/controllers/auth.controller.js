import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import upload from "../utils/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    generateTokenAndSetCookie(res, user._id);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log("Error in signup backend", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(res, user._id);
    return res.status(200).json({
      message: "User Logged In successfully",
      user,
    });
  } catch (error) {
    console.log("Error in login backend", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User Logged Out successfully" });
  } catch (error) {
    console.log("Error in logout backend", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({
      message: "User is authenticated",
      user,
    });
  } catch (error) {
    console.log("Error in checkAuth backend", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAssistantDetails = async (req, res) => {
  try {
    const { assistantName } = req.body;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "Assistant image is required" });
    }

    if (!assistantName || !assistantName.trim()) {
      return res.status(400).json({ message: "Assistant name is required" });
    }

    const imageUrl = await upload(req.file.path);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        assistantName: assistantName.trim(),
        assistantImage: imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Assistant details updated successfully",
      user,
    });
  } catch (error) {
    console.log("Error in updateAssistantDetails backend", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
