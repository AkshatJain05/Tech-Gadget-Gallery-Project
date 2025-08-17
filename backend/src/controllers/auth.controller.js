import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hassed = await bcrypt.hash(password, 10);
    const userInstance = await User.create({
      userName,
      email,
      password: hassed,
    });
    res.status(201).json({
      message: "User created successfully",
      userInstance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "User registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Please Enter Correct detail" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Please Enter Correct detail" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        user,
      });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

const isLogin = async (req, res) => {
  const token = req.cookies.token;
  // console.log("checked...",req.cookies.token)
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch latest user info from DB
    const user = await User.findById(decoded.userId).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};


const adminLogin = async(req,res)=> {
       const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Please Enter Correct detail" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Please Enter Correct detail" });
    }

    if(!user.isAdmin){
       return res.status(400).json({message:"You are not Admin"});
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Admin Login successful",
        user,
      });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }

}
export { login, register, logout ,isLogin,adminLogin };
