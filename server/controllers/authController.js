import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import generatePilgrimId from "../utils/generatePilgrimId.js";

// Register User
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      confirmPassword,
    } = req.body;

    // Validations
    if (
      !name ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Duplicate Email 
    const emailExists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // Duplicate Mobile
    const mobileExists = await User.findOne({
      mobile,
    });

    if (mobileExists) {
      return res.status(409).json({
        success: false,
        message: "Mobile number already registered.",
      });
    }

    const pilgrimId = await generatePilgrimId();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      pilgrimId,

      name,

      email: email.toLowerCase(),

      mobile,

      password: hashedPassword,
    });

    // JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,

      message:
        "Account created successfully.",

      token,

      pilgrim: {
        id: user._id,

        pilgrimId: user.pilgrimId,

        name: user.name,

        email: user.email,

        mobile: user.mobile,

        role: user.role,

        profileCompleted:
          user.profileCompleted,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Identifier and password are required.",
      });
    }

    const user = await User.findOne({
      $or: [
        {
          email: identifier.toLowerCase(),
        },
        {
          pilgrimId: identifier,
        },
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email/Pilgrim ID or password.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email/Pilgrim ID or password.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,

      message: "Login successful.",

      token,

      pilgrim: {
        id: user._id,

        pilgrimId: user.pilgrimId,

        name: user.name,

        email: user.email,

        mobile: user.mobile,

        role: user.role,

        profileCompleted:
          user.profileCompleted,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Current User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,

      pilgrim: {
        id: user._id,
        pilgrimId: user.pilgrimId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profileCompleted:
          user.profileCompleted,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Logout
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// register volunteer
export const registerVolunteer = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      confirmPassword,
    } = req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const emailExists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const mobileExists = await User.findOne({
      mobile,
    });

    if (mobileExists) {
      return res.status(409).json({
        success: false,
        message: "Mobile already exists.",
      });
    }

    const pilgrimId = await generatePilgrimId();

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const volunteer = await User.create({
      pilgrimId,

      name,

      email: email.toLowerCase(),

      mobile,

      password: hashedPassword,

      role: "volunteer",

      profileCompleted: true,
    });

    res.status(201).json({
      success: true,
      message:
        "Volunteer registered successfully.",
      volunteer: {
        id: volunteer._id,
        pilgrimId: volunteer.pilgrimId,
        name: volunteer.name,
        email: volunteer.email,
        mobile: volunteer.mobile,
        role: volunteer.role,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Volunteer Login
export const volunteerLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const volunteer = await User.findOne({
      email: identifier.toLowerCase(),
    }).select("+password");

    if (!volunteer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (volunteer.role !== "volunteer") {
      return res.status(403).json({
        success: false,
        message: "This account is not registered as a volunteer.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      volunteer.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(volunteer._id);

    res.status(200).json({
      success: true,
      message: "Volunteer login successful.",

      token,

      volunteer: {
        id: volunteer._id,

        pilgrimId: volunteer.pilgrimId,

        name: volunteer.name,

        email: volunteer.email,

        mobile: volunteer.mobile,

        role: volunteer.role,

        profileCompleted:
          volunteer.profileCompleted,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};