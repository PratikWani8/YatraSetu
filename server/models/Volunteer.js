import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
   
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "",
      required: true,
    },

    dob: {
      type: Date,
      default: null,
    },

    age: {
      type: Number,
      default: null,
    },

    bloodGroup: {
      type: String,
      enum: [
        "",
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      default: "",
    },

    aadhaarNumber: {
      type: String,
      default: "",
      trim: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    
    alternateMobile: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    
    volunteerRole: {
      type: String,
      default: "",
    },

    assignedZone: {
      type: String,
      default: "",
    },

    organization: {
      type: String,
      default: "",
    },

    volunteerSince: {
      type: Date,
      default: null,
    },

    availability: {
      type: String,
      default: "",
    },

    languages: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      default: "",
    },

    emergencyContact: {
      name: {
        type: String,
        default: "",
      },

      relationship: {
        type: String,
        default: "",
      },

      mobile: {
        type: String,
        default: "",
      },

      alternateMobile: {
        type: String,
        default: "",
      },
    },

    medical: {
      allergies: {
        type: String,
        default: "",
      },

      conditions: {
        type: String,
        default: "",
      },

      medications: {
        type: String,
        default: "",
      },

      organDonor: {
        type: Boolean,
        default: false,
      },
    },

    skills: {
      firstAid: {
        type: Boolean,
        default: false,
      },

      cpr: {
        type: Boolean,
        default: false,
      },

      disasterManagement: {
        type: Boolean,
        default: false,
      },

      crowdManagement: {
        type: Boolean,
        default: false,
      },

      searchRescue: {
        type: Boolean,
        default: false,
      },

      fireSafety: {
        type: Boolean,
        default: false,
      },
    },

    aadhaarDocument: {
      type: String,
      default: "",
    },

    volunteerIdDocument: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Volunteer",
  volunteerSchema
);