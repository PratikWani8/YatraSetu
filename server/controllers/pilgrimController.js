import fs from "fs";
import User from "../models/User.js";
import Pilgrim from "../models/Pilgrim.js";

// Register Pilgrim
export const registerPilgrim = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      bloodGroup,
      mobile,
      address,
      medicalHistory,
      allergies,
      emergencyName,
      emergencyNumber,
      aadhaarNumber,
    } = req.body;

  const user = req.user;

const existingPilgrim = await Pilgrim.findOne({
  pilgrimId: user.pilgrimId,
});

if (existingPilgrim) {
  return res.status(409).json({
    success: false,
    message: "Pilgrim profile already exists.",
  });
}

    if (
      !age ||
      !gender ||
      !bloodGroup ||
      !emergencyName ||
      !emergencyNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (aadhaarNumber) {
      const aadhaarExists = await Pilgrim.findOne({
        aadhaarNumber,
      });

      if (aadhaarExists) {
        return res.status(409).json({
          success: false,
          message: "Aadhaar already registered.",
        });
      }
    }

    let photo = "";

    let aadhaarImage = "";

    if (req.files?.photo) {
      photo =
        "/uploads/photos/" +
        req.files.photo[0].filename;
    }

    if (req.files?.aadhaarImage) {
      aadhaarImage =
        "/uploads/aadhaar/" +
        req.files.aadhaarImage[0].filename;
    }

    const pilgrim = await Pilgrim.create({
  pilgrimId: user.pilgrimId,

  name: user.name,
  age,
  gender,
  bloodGroup,
  mobile: user.mobile,
  address,
  medicalHistory,
  allergies,
  emergencyName,
  emergencyNumber,
  aadhaarNumber,
  photo,
  aadhaarImage,
});

    res.status(201).json({
      success: true,
      message: "Pilgrim Registered Successfully",

      pilgrim,
    });
  } catch (err) {
    console.error(err);

    if (req.files?.photo) {
      fs.unlinkSync(req.files.photo[0].path);
    }

    if (req.files?.aadhaarImage) {
      fs.unlinkSync(req.files.aadhaarImage[0].path);
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Check Aadhaar
export const checkAadhaar = async (
  req,
  res
) => {
  try {
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number required",
      });
    }

    const pilgrim = await Pilgrim.findOne({
      aadhaarNumber,
    });

    res.json({
      success: true,
      exists: !!pilgrim,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Pilgrims
export const getAllPilgrims = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      status,
      bloodGroup,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { pilgrimId: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    const total = await Pilgrim.countDocuments(query);

    const pilgrims = await Pilgrim.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      pilgrims,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Pilgrim
export const getPilgrimById = async (req, res) => {
  try {
    const pilgrim = await Pilgrim.findById(req.params.id);

    if (!pilgrim) {
      return res.status(404).json({
        success: false,
        message: "Pilgrim not found",
      });
    }

    res.status(200).json({
      success: true,
      pilgrim,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Pilgrim
export const updatePilgrim = async (req, res) => {
  try {
    const pilgrim = await Pilgrim.findById(req.params.id);

    if (!pilgrim) {
      return res.status(404).json({
        success: false,
        message: "Pilgrim not found",
      });
    }

    if (
      req.body.mobile &&
      req.body.mobile !== pilgrim.mobile
    ) {
      const mobileExists = await Pilgrim.findOne({
        mobile: req.body.mobile,
      });

      if (mobileExists) {
        return res.status(409).json({
          success: false,
          message: "Mobile already exists",
        });
      }
    }

    if (
      req.body.aadhaarNumber &&
      req.body.aadhaarNumber !== pilgrim.aadhaarNumber
    ) {
      const aadhaarExists = await Pilgrim.findOne({
        aadhaarNumber: req.body.aadhaarNumber,
      });

      if (aadhaarExists) {
        return res.status(409).json({
          success: false,
          message: "Aadhaar already exists",
        });
      }
    }

    if (req.files?.photo) {
      if (pilgrim.photo) {
        const oldPhoto =
          "." + pilgrim.photo;

        if (fs.existsSync(oldPhoto)) {
          fs.unlinkSync(oldPhoto);
        }
      }

      pilgrim.photo =
        "/uploads/photos/" +
        req.files.photo[0].filename;
    }

    if (req.files?.aadhaarImage) {
      if (pilgrim.aadhaarImage) {
        const oldAadhaar =
          "." + pilgrim.aadhaarImage;

        if (fs.existsSync(oldAadhaar)) {
          fs.unlinkSync(oldAadhaar);
        }
      }

      pilgrim.aadhaarImage =
        "/uploads/aadhaar/" +
        req.files.aadhaarImage[0].filename;
    }

    Object.keys(req.body).forEach((key) => {
      pilgrim[key] = req.body[key];
    });

    await pilgrim.save();

    res.status(200).json({
      success: true,
      message: "Pilgrim updated successfully",
      pilgrim,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Pilgrim
export const deletePilgrim = async (req, res) => {
  try {
    const pilgrim = await Pilgrim.findOne({
  pilgrimId: req.user.pilgrimId,
});

    if (!pilgrim) {
      return res.status(404).json({
        success: false,
        message: "Pilgrim not found",
      });
    }

    if (pilgrim.photo) {
      const oldPhoto = "." + pilgrim.photo;

      if (fs.existsSync(oldPhoto)) {
        fs.unlinkSync(oldPhoto);
      }
    }

    if (pilgrim.aadhaarImage) {
      const oldAadhaar =
        "." + pilgrim.aadhaarImage;

      if (fs.existsSync(oldAadhaar)) {
        fs.unlinkSync(oldAadhaar);
      }
    }

    await pilgrim.deleteOne();

    res.status(200).json({
      success: true,
      message: "Pilgrim deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPilgrimDashboard = async (
  req,
  res
) => {
  try {
    const pilgrim = await Pilgrim.findOne({
      pilgrimId: req.user.pilgrimId,
    });

    if (!pilgrim) {
      return res.status(404).json({
        success: false,
        message: "Pilgrim not found",
      });
    }

    res.status(200).json({
      success: true,
      pilgrim,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Scan Qr
export const getPilgrimByQR = async (req, res) => {
  try {
    const { pilgrimId } = req.params;

    const pilgrim = await Pilgrim.findOne({
      pilgrimId,
    }).select(
      `
      pilgrimId
      fullName
      gender
      age
      bloodGroup
      mobile
      emergencyContact
      medicalConditions
      city
      state
      photo
      qrCode
      `
    );

    if (!pilgrim) {
      return res.status(404).json({
        success: false,
        message: "Pilgrim not found",
      });
    }

    res.status(200).json({
      success: true,
      pilgrim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};