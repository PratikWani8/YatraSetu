import mongoose from "mongoose";

const pilgrimSchema = new mongoose.Schema(
  {
    pilgrimId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },

    address: {
      type: String,
      default: "",
    },

    medicalHistory: {
      type: String,
      default: "",
    },

    allergies: {
      type: String,
      default: "",
    },

    emergencyName: {
      type: String,
      required: true,
    },

    emergencyNumber: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },

    aadhaarNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    photo: {
      type: String,
      default: "",
    },

    aadhaarImage: {
      type: String,
      default: "",
    },

    qrCode: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Registered", "Checked-In", "Medical", "Completed"],
      default: "Registered",
    },

    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pilgrim", pilgrimSchema);