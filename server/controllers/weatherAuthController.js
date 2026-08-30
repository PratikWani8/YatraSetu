import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ==========================================
   Register Weather Officer
========================================== */

export const registerWeatherOfficer = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const existingMobile = await User.findOne({
      mobile,
    });

    if (existingMobile) {
      return res.status(400).json({
        message: "Mobile already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const weatherOfficer = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "weather_officer",
      profileCompleted: true,
      isVerified: true,
    });

    const token = jwt.sign(
      {
        id: weatherOfficer._id,
        role: weatherOfficer.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      token,
      weatherOfficer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ==========================================
   Login Weather Officer
========================================== */

export const loginWeatherOfficer = async (
  req,
  res
) => {
  try {
    const { email, password } = req.body;

    const weatherOfficer =
      await User.findOne({
        email,
        role: "weather_officer",
      }).select("+password");

    if (!weatherOfficer) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      weatherOfficer.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: weatherOfficer._id,
        role: weatherOfficer.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    weatherOfficer.password = undefined;

    res.json({
      success: true,
      token,
      weatherOfficer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ==========================================
   Weather Officer Profile
========================================== */

export const getWeatherOfficerProfile =
  async (req, res) => {
    try {
      const weatherOfficer =
        await User.findById(req.user.id);

      res.json(weatherOfficer);
    } catch (error) {
      res.status(500).json({
        message: "Server Error",
      });
    }
  };