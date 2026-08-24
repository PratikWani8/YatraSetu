import mongoose from "mongoose";

const qrScanSchema = new mongoose.Schema(
  {
    pilgrim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pilgrim",
      required: true,
    },

    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scannedRole: {
      type: String,
      enum: [
        "volunteer",
        "medical",
        "police",
        "admin",
        "control_room",
      ],
      required: true,
    },

    pilgrimId: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    device: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    scannedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("QRScan", qrScanSchema);