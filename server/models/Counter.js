import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    sequenceValue: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Counter", counterSchema);