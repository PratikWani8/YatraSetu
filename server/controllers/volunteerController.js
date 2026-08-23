import Volunteer from "../models/Volunteer.js";
import User from "../models/User.js";

export const getVolunteerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
  "name email mobile role pilgrimId createdAt isVerified status"
);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let volunteer = await Volunteer.findOne({
      user: req.user._id,
    });

    if (!volunteer) {
      return res.status(200).json({
        success: true,
        volunteer: {
          fullName: user.name,
          username: user.name,
          email: user.email,
          mobile: user.mobile,
          volunteerId: user.pilgrimId,
          gender: "",
          dob: "",
          age: "",
          bloodGroup: "",
          aadhaarNumber: "",
          registrationDate: user.createdAt,
          emailVerified: user.isVerified ?? true,
          accountStatus: user.status || "Active",

          profilePhoto: "",

          alternateMobile: "",
          address: "",
          district: "",
          state: "",
          pincode: "",

          volunteerRole: "",
          assignedZone: "",
          organization: "",
          volunteerSince: "",
          availability: "",
          languages: [],

          bio: "",

          emergencyContact: {
            name: "",
            relationship: "",
            mobile: "",
            alternateMobile: "",
          },

          medical: {
            allergies: "",
            conditions: "",
            medications: "",
            organDonor: false,
          },

          skills: {
            firstAid: false,
            cpr: false,
            disasterManagement: false,
            crowdManagement: false,
            searchRescue: false,
            fireSafety: false,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      volunteer: {
        // ---------------- User ----------------

        fullName: user.name,
        username: user.name,
        email: user.email,
        mobile: user.mobile,
        volunteerId: user.pilgrimId,

        // --------------- Volunteer -------------

        gender: volunteer.gender,
        dob: volunteer.dob,
        age: volunteer.age,
        bloodGroup: volunteer.bloodGroup,
        aadhaarNumber: volunteer.aadhaarNumber,
        registrationDate: user.createdAt,
        emailVerified: user.isVerified ?? true,
        accountStatus: user.status || "Active",

        profilePhoto: volunteer.profilePhoto,

        alternateMobile: volunteer.alternateMobile,
        address: volunteer.address,
        district: volunteer.district,
        state: volunteer.state,
        pincode: volunteer.pincode,

        volunteerRole: volunteer.volunteerRole,
        assignedZone: volunteer.assignedZone,
        organization: volunteer.organization,
        volunteerSince: volunteer.volunteerSince,
        availability: volunteer.availability,
        languages: volunteer.languages,

        bio: volunteer.bio,

        emergencyContact: volunteer.emergencyContact,

        medical: volunteer.medical,

        skills: volunteer.skills,

        aadhaarDocument: volunteer.aadhaarDocument,

        volunteerIdDocument:
          volunteer.volunteerIdDocument,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateVolunteerProfile = async (
  req,
  res
) => {
  try {
    let volunteer = await Volunteer.findOne({
      user: req.user._id,
    });

    if (!volunteer) {
      volunteer = new Volunteer({
        user: req.user._id,
      });
    }

    const data = req.body;
    
    volunteer.gender = data.gender;
    volunteer.dob = data.dob;
    volunteer.age = data.age;
    volunteer.bloodGroup =
      data.bloodGroup;

    volunteer.aadhaarNumber =
      data.aadhaarNumber;

    // ---------------- Contact ----------------

    volunteer.alternateMobile =
      data.alternateMobile;

    volunteer.address =
      data.address;

    volunteer.district =
      data.district;

    volunteer.state =
      data.state;

    volunteer.pincode =
      data.pincode;

    // ---------------- Volunteer ----------------

    volunteer.volunteerRole =
      data.volunteerRole;

    volunteer.assignedZone =
      data.assignedZone;

    volunteer.organization =
      data.organization;

    volunteer.volunteerSince =
      data.volunteerSince;

    volunteer.availability =
      data.availability;

    volunteer.languages =
      data.languages
        ? data.languages
            .split(",")
            .map((item) => item.trim())
        : [];

    volunteer.bio = data.bio;

    // ---------------- Emergency ----------------

    volunteer.emergencyContact = {
      name: data.emergencyName,
      relationship:
        data.relationship,
      mobile:
        data.emergencyMobile,
      alternateMobile:
        data.emergencyAlternateMobile,
    };

    // ---------------- Medical ----------------

    volunteer.medical = {
      allergies:
        data.allergies,

      conditions:
        data.conditions,

      medications:
        data.medications,

      organDonor:
        data.organDonor ===
        "true",
    };

    // ---------------- Skills ----------------

    volunteer.skills = {
      firstAid:
        data.firstAid ===
        "true",

      cpr:
        data.cpr ===
        "true",

      disasterManagement:
        data.disasterManagement ===
        "true",

      crowdManagement:
        data.crowdManagement ===
        "true",

      searchRescue:
        data.searchRescue ===
        "true",

      fireSafety:
        data.fireSafety ===
        "true",
    };

    // ---------------- Uploads ----------------

    if (
      req.files?.profilePhoto?.length
    ) {
      volunteer.profilePhoto =
        req.files.profilePhoto[0].filename;
    }

    if (
      req.files?.aadhaarDocument
        ?.length
    ) {
      volunteer.aadhaarDocument =
        req.files.aadhaarDocument[0].filename;
    }

    if (
      req.files?.volunteerIdDocument
        ?.length
    ) {
      volunteer.volunteerIdDocument =
        req.files
          .volunteerIdDocument[0]
          .filename;
    }

    await volunteer.save();

    res.status(200).json({
      success: true,
      message:
        "Volunteer profile updated successfully.",
      volunteer,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =======================================================
   DELETE PROFILE
======================================================= */

export const deleteVolunteerProfile =
  async (req, res) => {
    try {
      await Volunteer.deleteOne({
        user: req.user._id,
      });

      res.json({
        success: true,
        message:
          "Volunteer profile deleted successfully.",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };