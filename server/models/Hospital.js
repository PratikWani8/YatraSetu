import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: String,
      unique: true,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    hospitalType: {
      type: String,
      enum: ["Government", "Private", "Trust", "Clinic"],
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    emergencyContact: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
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

    totalDoctors: {
      type: Number,
      default: 0,
    },

    totalNurses: {
      type: Number,
      default: 0,
    },

    totalBeds: {
      type: Number,
      default: 0,
    },

    availableBeds: {
      type: Number,
      default: 0,
    },

    icuBeds: {
      type: Number,
      default: 0,
    },

    ambulanceAvailable: {
      type: Boolean,
      default: false,
    },

    departments: [
      {
        type: String,
      },
    ],

    logo: {
      type: String,
      default: "",
    },

    licenseDocument: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Hospital", hospitalSchema);