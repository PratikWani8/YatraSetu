import Counter from "../models/Counter.js";
import FoodDistribution from "../models/FoodDistribution.js";

export const createFoodDistribution = async (
  req,
  res
) => {
  try {
    const {
      campName,
      location,
      sector,
      foodPackets,
      meals,
      volunteer,
      status,
      notes,
    } = req.body;

    /* Generate Distribution ID */

    const counter =
      await Counter.findByIdAndUpdate(
        "foodDistribution",
        {
          $inc: {
            sequenceValue: 1,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

    const distributionId = `FD-${new Date().getFullYear()}-${String(
      counter.sequenceValue
    ).padStart(6, "0")}`;

    /* Create Distribution */

    const distribution =
      await FoodDistribution.create({
        distributionId,
        ngo: req.user.id,
        campName,
        location,
        sector,
        foodPackets,
        meals,
        volunteer,
        status,
        notes,
      });

    res.status(201).json({
      success: true,
      message:
        "Food distribution created successfully.",
      distribution,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
    Get All Food Distributions
========================================== */

export const getFoodDistributions = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      sector = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      ngo: req.user.id,
    };

    /* Search */

    if (search) {
      query.$or = [
        {
          distributionId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          campName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          location: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* Sector */

    if (sector) {
      query.sector = sector;
    }

    /* Status */

    if (status) {
      query.status = status;
    }

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const total =
      await FoodDistribution.countDocuments(
        query
      );

    const records =
      await FoodDistribution.find(query)
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
        })
        .skip(
          (currentPage - 1) *
            pageLimit
        )
        .limit(pageLimit);

    /* ==========================
          Dashboard Stats
    ========================== */

    const totalPackets =
      await FoodDistribution.aggregate([
        {
          $match: {
            ngo: req.user._id,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$foodPackets",
            },
          },
        },
      ]);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const distributedToday =
      await FoodDistribution.aggregate([
        {
          $match: {
            ngo: req.user._id,
            distributedAt: {
              $gte: today,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$foodPackets",
            },
          },
        },
      ]);

    const activeVolunteers =
      await FoodDistribution.distinct(
        "volunteer",
        {
          ngo: req.user._id,
          volunteer: {
            $ne: null,
          },
        }
      );

    const camps =
      await FoodDistribution.distinct(
        "campName",
        {
          ngo: req.user._id,
        }
      );

    res.json({
      success: true,

      records,

      stats: {
        totalPackets:
          totalPackets[0]?.total || 0,

        distributedToday:
          distributedToday[0]?.total ||
          0,

        activeVolunteers:
          activeVolunteers.length,

        camps: camps.length,
      },

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
      message: error.message,
    });
  }
};

/* ==========================================
    Get Single Food Distribution
========================================== */

export const getFoodDistribution = async (
  req,
  res
) => {
  try {
    const distribution =
      await FoodDistribution.findOne({
        _id: req.params.id,
        ngo: req.user.id,
      }).populate({
        path: "volunteer",
        select:
          "profilePhoto volunteerId user",
        populate: {
          path: "user",
          select: "name mobile email",
        },
      });

    if (!distribution) {
      return res.status(404).json({
        success: false,
        message:
          "Food distribution record not found.",
      });
    }

    res.json({
      success: true,
      distribution,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
    Update Food Distribution
========================================== */

export const updateFoodDistribution =
  async (req, res) => {
    try {
      const distribution =
        await FoodDistribution.findOneAndUpdate(
          {
            _id: req.params.id,
            ngo: req.user.id,
          },
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!distribution) {
        return res.status(404).json({
          success: false,
          message:
            "Food distribution record not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Food distribution updated successfully.",
        distribution,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* ==========================================
    Delete Food Distribution
========================================== */

export const deleteFoodDistribution =
  async (req, res) => {
    try {
      const distribution =
        await FoodDistribution.findOneAndDelete(
          {
            _id: req.params.id,
            ngo: req.user.id,
          }
        );

      if (!distribution) {
        return res.status(404).json({
          success: false,
          message:
            "Food distribution record not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Food distribution deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };