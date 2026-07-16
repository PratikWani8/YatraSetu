import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    pilgrimId: {
    type: String,
    required: function () {
    return this.role === "pilgrim";
  },
},

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "pilgrim",
        "volunteer",
        "ngo",
        "medical",
        "hospital",
        "police",
        "control_room",
        "admin",
        "super_admin",
      ],
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
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

export default mongoose.model("User", userSchema);