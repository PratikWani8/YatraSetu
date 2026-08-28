import WaterDistribution from "../models/WaterDistribution.js";
import FoodDistribution from "../models/FoodDistribution.js";
import Volunteer from "../models/Volunteer.js";

/* ==========================================
    Get Volunteer Assignments
========================================== */

export const getAssignments = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      type = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const volunteer =
  await Volunteer.findOne({
    user: req.user.id,
  });

if (!volunteer) {
  return res.status(404).json({
    success: false,
    message: "Volunteer profile not found.",
  });
}
    /* ======================================
        Fetch Water Assignments
    ====================================== */

    const waterAssignments =
      await WaterDistribution.find({
        volunteer: volunteer._id,
      })
        .populate({
          path: "volunteer",
          select:
            "profilePhoto volunteerId user",
          populate: {
            path: "user",
            select: "name mobile",
          },
        })
        .sort({
          createdAt: -1,
        });

    /* ======================================
        Fetch Food Assignments
    ====================================== */

    const foodAssignments =
      await FoodDistribution.find({
        volunteer: volunteer._id,
      })
        .populate({
          path: "volunteer",
          select:
            "profilePhoto volunteerId user",
          populate: {
            path: "user",
            select: "name mobile",
          },
        })
        .sort({
          createdAt: -1,
        });

    /* ======================================
        Convert Water Assignments
    ====================================== */

    const water = waterAssignments.map(
      (item) => ({
        ...item.toObject(),

        type: "Water",

        quantity: item.quantity,
      })
    );

    /* ======================================
        Convert Food Assignments
    ====================================== */

    const food = foodAssignments.map(
      (item) => ({
        ...item.toObject(),

        type: "Food",

        quantity:
          item.foodPackets,
      })
    );

        /* ======================================
        Merge Assignments
    ====================================== */

    let assignments = [
      ...water,
      ...food,
    ];

    /* ======================================
        Search
    ====================================== */

    if (search) {
      const keyword =
        search.toLowerCase();

      assignments =
        assignments.filter(
          (item) =>
            item.campName
              ?.toLowerCase()
              .includes(keyword) ||
            item.location
              ?.toLowerCase()
              .includes(keyword) ||
            item.distributionId
              ?.toLowerCase()
              .includes(keyword)
        );
    }

    /* ======================================
        Type Filter
    ====================================== */

    if (type) {
      assignments =
        assignments.filter(
          (item) =>
            item.type === type
        );
    }

    /* ======================================
        Status Filter
    ====================================== */

    if (status) {
      assignments =
        assignments.filter(
          (item) =>
            item.status === status
        );
    }

    /* ======================================
        Sort Latest First
    ====================================== */

    assignments.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(a.createdAt)
    );

    /* ======================================
        Statistics
    ====================================== */

    const stats = {
      total:
        assignments.length,

      pending:
        assignments.filter(
          (item) =>
            item.status ===
            "Pending"
        ).length,

      inProgress:
        assignments.filter(
          (item) =>
            item.status ===
            "In Progress"
        ).length,

      completed:
        assignments.filter(
          (item) =>
            item.status ===
            "Completed"
        ).length,
    };

    /* ======================================
        Pagination
    ====================================== */

    const currentPage =
      Number(page);

    const pageLimit =
      Number(limit);

    const total =
      assignments.length;

    const startIndex =
      (currentPage - 1) *
      pageLimit;

    const endIndex =
      startIndex + pageLimit;

    const paginatedAssignments =
      assignments.slice(
        startIndex,
        endIndex
      );

    /* ======================================
        Response
    ====================================== */

    res.json({
      success: true,

      assignments:
        paginatedAssignments,

      stats,

      pagination: {
        page: currentPage,

        totalPages: Math.ceil(
          total / pageLimit
        ),

        total,

        limit: pageLimit,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

/* ==========================================
    Update Assignment Status
========================================== */

export const updateAssignmentStatus =
  async (req, res) => {
    try {
        const volunteer =
  await Volunteer.findOne({
    user: req.user.id,
  });

if (!volunteer) {
  return res.status(404).json({
    success: false,
    message: "Volunteer profile not found.",
  });
}
      const { status } = req.body;

      if (
        ![
          "Pending",
          "In Progress",
          "Completed",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid status.",
        });
      }

      let assignment = null;

      /* ======================================
          Water Distribution
      ====================================== */

      assignment =
        await WaterDistribution.findOne({
          _id: req.params.id,
          volunteer: volunteer._id,
        });

      /* ======================================
          Food Distribution
      ====================================== */

      if (!assignment) {
        assignment =
          await FoodDistribution.findOne({
            _id: req.params.id,
            volunteer: volunteer._id,
          });
      }

      /* ======================================
          Assignment Not Found
      ====================================== */

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message:
            "Assignment not found.",
        });
      }

      /* ======================================
          Prevent Re-completing
      ====================================== */

      if (
        assignment.status ===
        "Completed"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Assignment is already completed.",
        });
      }

      /* ======================================
          Update Status
      ====================================== */

      assignment.status = status;

      /* If completed update completion time */

      if (status === "Completed") {
        assignment.completedAt =
          new Date();
      }

      await assignment.save();

      res.json({
        success: true,
        message:
          "Assignment status updated successfully.",
        assignment,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };