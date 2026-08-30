import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Hospital from "../models/Hospital.js";
import Counter from "../models/Counter.js";

/* ==========================================
   Register Hospital
========================================== */

export const registerHospital = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "hospital",
      profileCompleted: false,
      isVerified: true,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Hospital registered successfully.",
      token,
      hospital: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   Login Hospital
========================================== */

export const loginHospital = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: identifier.toLowerCase(),
      role: "hospital",
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Hospital account not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      hospital: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getHospitalProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email mobile"
    );

    const hospital = await Hospital.findOne({
      user: req.user.id,
    });

    res.json({
      success: true,
      user,
      hospital,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};