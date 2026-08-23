import mongoose from "mongoose";

const missingPersonSchema = new mongoose.Schema({
    
    reportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    pilgrim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pilgrim",
      required: true,
    },

    pilgrimId: {
      type: String,
      required: true,
    },

    pilgrimName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    bloodGroup: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    lastSeenLocation: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    lastSeenTime: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "Reported",
        "Searching",
        "Police Assigned",
        "Found",
        "Closed",
      ],
      default: "Reported",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    volunteerName: {
      type: String,
      required: true,
    },

    volunteerMobile: {
      type: String,
      required: true,
    },

    assignedPolice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    foundLocation: {
      type: String,
      default: "",
    },

    foundTime: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "MissingPerson",
  missingPersonSchema
);