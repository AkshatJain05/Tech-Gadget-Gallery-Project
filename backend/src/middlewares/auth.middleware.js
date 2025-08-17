import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; 

const auth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    // console.log("checked-----",req.user)
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};


// middleware/authMiddleware.js
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};


export {auth,isAdmin}
