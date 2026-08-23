import fs from "fs";
import MissingPerson from "../models/MissingPerson.js";
import Pilgrim from "../models/Pilgrim.js";
import User from "../models/User.js";
import generateMissingReportId from "../utils/generateMissingReportId.js";

export const reportMissingPerson = async (req, res) => {
  try {
    const {
      pilgrimId,
      lastSeenLocation,
      latitude,
      longitude,
      lastSeenTime,
      priority,
      description,
    } = req.body;

    if (
      !pilgrimId ||
      !lastSeenLocation ||
      !latitude ||
      !longitude ||
      !lastSeenTime ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const pilgrim = await Pilgrim.findOne({
      pilgrimId,
    });

    if (!pilgrim) {
      return res.status(404).json({
        success: false,
        message: "Pilgrim not found.",
      });
    }

    const alreadyReported =
      await MissingPerson.findOne({
        pilgrimId,
        status: {
          $nin: ["Found", "Closed"],
        },
      });

    if (alreadyReported) {
      return res.status(409).json({
        success: false,
        message:
          "This pilgrim has already been reported missing.",
      });
    }

    const volunteer = await User.findById(
      req.user._id
    );

    let photo = pilgrim.photo;

    if (req.file) {
      photo =
        "/uploads/missing/" +
        req.file.filename;
    }

    const reportId =
      await generateMissingReportId();

    const report =
      await MissingPerson.create({
        reportId,

        pilgrim: pilgrim._id,

        pilgrimId: pilgrim.pilgrimId,

        pilgrimName: pilgrim.name,

        age: pilgrim.age,

        gender: pilgrim.gender,

        bloodGroup: pilgrim.bloodGroup,

        photo,

        lastSeenLocation,

        latitude,

        longitude,

        lastSeenTime,

        description,

        priority,

        reportedBy: volunteer._id,

        volunteerName: volunteer.name,

        volunteerMobile: volunteer.mobile,
      });

    res.status(201).json({
      success: true,

      message:
        "Missing person reported successfully.",

      report,
    });
  } catch (err) {
    console.error(err);

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllMissingReports = async (
  req,
  res
) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search = "",
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        {
          pilgrimName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          pilgrimId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          reportId: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total =
      await MissingPerson.countDocuments(query);

    const reports =
      await MissingPerson.find(query)
        .populate(
          "reportedBy",
          "name mobile"
        )
        .populate(
          "assignedPolice",
          "name mobile"
        )
        .sort({
          createdAt: -1,
        })
        .skip((page - 1) * Number(limit))
        .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(
        total / Number(limit)
      ),
      reports,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMissingReportById = async (
  req,
  res
) => {
  try {
    const report =
      await MissingPerson.findById(
        req.params.id
      )
        .populate("reportedBy")
        .populate("assignedPolice")
        .populate("assignedVolunteer")
        .populate("pilgrim");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMissingStatistics =
  async (req, res) => {
    try {
      const total =
        await MissingPerson.countDocuments();

      const reported =
        await MissingPerson.countDocuments({
          status: "Reported",
        });

      const searching =
        await MissingPerson.countDocuments({
          status: "Searching",
        });

      const assigned =
        await MissingPerson.countDocuments({
          status: "Police Assigned",
        });

      const found =
        await MissingPerson.countDocuments({
          status: "Found",
        });

      const closed =
        await MissingPerson.countDocuments({
          status: "Closed",
        });

      const critical =
        await MissingPerson.countDocuments({
          priority: "Critical",
        });

      res.json({
        success: true,

        statistics: {
          total,
          reported,
          searching,
          assigned,
          found,
          closed,
          critical,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

export const updateMissingStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const report =
        await MissingPerson.findById(
          req.params.id
        );

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found.",
        });
      }

      report.status = status;

      await report.save();

      res.json({
        success: true,
        message:
          "Status updated successfully.",
        report,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

export const assignPoliceOfficer =
  async (req, res) => {
    try {
      const { policeId } = req.body;

      const report =
        await MissingPerson.findById(
          req.params.id
        );

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found.",
        });
      }

      const police =
        await User.findById(policeId);

      if (!police) {
        return res.status(404).json({
          success: false,
          message:
            "Police officer not found.",
        });
      }

      report.assignedPolice =
        police._id;

      report.status =
        "Police Assigned";

      await report.save();

      res.json({
        success: true,
        message:
          "Police assigned successfully.",
        report,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

export const markPersonFound =
  async (req, res) => {
    try {
      const {
        foundLocation,
        remarks,
      } = req.body;

      const report =
        await MissingPerson.findById(
          req.params.id
        );

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found.",
        });
      }

      report.status = "Found";

      report.foundLocation =
        foundLocation;

      report.remarks = remarks;

      report.foundTime = new Date();

      await report.save();

      res.json({
        success: true,
        message:
          "Missing person marked as found.",
        report,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };