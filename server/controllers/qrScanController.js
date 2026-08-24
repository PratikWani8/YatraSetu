import Pilgrim from "../models/Pilgrim.js";
import QRScan from "../models/QRScan.js";

// Scan Qr
export const scanQRCode = async (req, res) => {
  try {
    const { pilgrimId } = req.params;

    const { latitude, longitude } = req.query;

    const pilgrim = await Pilgrim.findOne({ pilgrimId });

    if (!pilgrim) {
      return res.status(404).json({
        success: false,
        message: "Pilgrim not found",
      });
    }

    await QRScan.create({
      pilgrim: pilgrim._id,

      pilgrimId,

      scannedBy: req.user._id,

      scannedRole: req.user.role,

      latitude,

      longitude,

      device: req.headers["user-agent"],

      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "QR scanned successfully.",
      pilgrim,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// My Scan History
export const getMyScans = async (req, res) => {
  try {
    const scans = await QRScan.find({
      scannedBy: req.user._id,
    })
      .populate("pilgrim")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: scans.length,
      scans,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Scan
export const getAllScans = async (req, res) => {
  try {
    const scans = await QRScan.find()
      .populate("pilgrim")
      .populate("scannedBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: scans.length,
      scans,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const qrStats = async (req, res) => {
  try {
    const totalScans = await QRScan.countDocuments();

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayScans = await QRScan.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

    const volunteerScans = await QRScan.countDocuments({
      scannedRole: "volunteer",
    });

    const medicalScans = await QRScan.countDocuments({
      scannedRole: "medical",
    });

    const policeScans = await QRScan.countDocuments({
      scannedRole: "police",
    });

    res.json({
      success: true,

      totalScans,

      todayScans,

      volunteerScans,

      medicalScans,

      policeScans,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};