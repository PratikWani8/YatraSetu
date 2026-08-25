import mongoose from "mongoose";

const waterDistributionSchema = new mongoose.Schema(
  {
    distributionId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },

    campName: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    sector: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    bottles: {
      type: Number,
      required: true,
      min: 0,
    },

    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
      ],
      default: "Pending",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    distributedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "WaterDistribution",
  waterDistributionSchema
);