import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import NGO from "../models/NGO.js";
import Counter from "../models/Counter.js";
import Volunteer from "../models/Volunteer.js";

export const registerNGO = async (req, res) => {
  try {
    const {
      organizationName,
      representativeName,
      email,
      mobile,
      password,
    } = req.body;

    if (
      !organizationName ||
      !representativeName ||
      !email ||
      !mobile ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    const mobileExists = await User.findOne({ mobile });

    if (mobileExists) {
      return res.status(400).json({
        message: "Mobile already registered.",
      });
    }

    // Generate NGO ID

    const counter = await Counter.findByIdAndUpdate(
      { _id: "ngoId" },
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
      }
    );

    const ngoId = `NGO-${new Date().getFullYear()}-${String(
      counter.seq
    ).padStart(6, "0")}`;

    // Hash password

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // Create User

    const user = await User.create({
      name: representativeName,
      email,
      mobile,
      password: hashedPassword,
      role: "ngo",
    });

    // Create NGO Profile

    const ngo = await NGO.create({
      ngoId,
      user: user._id,
      organizationName,
      representativeName,
      email,
      mobile,
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
      token,
      ngo,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Registration failed.",
    });
  }
};

export const loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find User

    const user = await User.findOne({
      email,
      role: "ngo",
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "NGO account not found.",
      });
    }

    // Compare Password

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Find NGO Profile

    const ngo = await NGO.findOne({
      user: user._id,
    });

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO profile not found.",
      });
    }

    // JWT

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
      ngo,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

export const getVolunteers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      zone = "",
      role = "",
      sort = "newest",
    } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    /* ----------------------------
       Build Filter
    -----------------------------*/

    const filter = {};

    if (zone) {
      filter.assignedZone = zone;
    }

    if (role) {
      filter.volunteerRole = role;
    }

    /* ----------------------------
       Sorting
    -----------------------------*/

    let sortOption = {};

    switch (sort) {
      case "name":
        sortOption = {
          "user.name": 1,
        };
        break;

      case "availability":
        sortOption = {
          availability: 1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    /* ----------------------------
       Fetch Volunteers
    -----------------------------*/

    let volunteers = await Volunteer.find(filter)
      .populate(
        "user",
        "name email mobile role isActive"
      )
      .sort(sortOption);

    /* ----------------------------
       Search
    -----------------------------*/

    if (search) {
      const keyword = search.toLowerCase();

      volunteers = volunteers.filter((volunteer) => {
        const user = volunteer.user;

        return (
          user?.name
            ?.toLowerCase()
            .includes(keyword) ||
          user?.email
            ?.toLowerCase()
            .includes(keyword) ||
          user?.mobile?.includes(keyword)
        );
      });
    }

    /* ----------------------------
       Pagination
    -----------------------------*/

    const totalVolunteers =
      volunteers.length;

    const totalPages = Math.ceil(
      totalVolunteers / pageSize
    );

    const start =
      (pageNumber - 1) * pageSize;

    const end = start + pageSize;

    const paginated =
      volunteers.slice(start, end);

    res.status(200).json({
      success: true,

      volunteers: paginated,

      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalPages,
        totalVolunteers,
        hasNext:
          pageNumber < totalPages,
        hasPrev:
          pageNumber > 1,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch volunteers.",
    });
  }
};