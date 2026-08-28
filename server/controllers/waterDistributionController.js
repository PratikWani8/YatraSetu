import Counter from "../models/Counter.js";
import WaterDistribution from "../models/WaterDistribution.js";

export const createWaterDistribution = async (
  req,
  res
) => {
  try {
    const {
      campName,
      location,
      sector,
      quantity,
      bottles,
      volunteer,
      status,
      notes,
    } = req.body;

    /* Generate Distribution ID */

    const counter = await Counter.findByIdAndUpdate(
  "waterDistribution",
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

const distributionId = `WD-${new Date().getFullYear()}-${String(
  counter.sequenceValue
).padStart(6, "0")}`;

    const distribution =
      await WaterDistribution.create({
        distributionId,
        ngo: req.user.id,
        campName,
        location,
        sector,
        quantity,
        bottles,
        volunteer,
        status,
        notes,
      });

    res.status(201).json({
      success: true,
      message:
        "Water distribution created successfully.",
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
    Get All Water Distribution
========================================== */

export const getWaterDistributions = async (
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

    /* Sector Filter */

    if (sector) {
      query.sector = sector;
    }

    /* Status Filter */

    if (status) {
      query.status = status;
    }

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const total = await WaterDistribution.countDocuments(
      query
    );

    const records =
      await WaterDistribution.find(query)
        .populate(
          "volunteer",
          "volunteerId user"
        )
        .populate({
  path: "volunteer",
  select:  "profilePhoto volunteerId user",
  populate: {
    path: "user",
    select: "name mobile",
  },
})
        .sort({
          createdAt: -1,
        })
        .skip(
          (currentPage - 1) * pageLimit
        )
        .limit(pageLimit);

    /* Dashboard Statistics */

    const totalStock =
      await WaterDistribution.aggregate([
        {
          $match: {
            ngo: req.user._id,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$quantity",
            },
          },
        },
      ]);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const distributedToday =
      await WaterDistribution.aggregate([
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
              $sum: "$quantity",
            },
          },
        },
      ]);

    const activeVolunteers =
      await WaterDistribution.distinct(
        "volunteer",
        {
          ngo: req.user._id,
          volunteer: {
            $ne: null,
          },
        }
      );

    const camps =
      await WaterDistribution.distinct(
        "campName",
        {
          ngo: req.user._id,
        }
      );

    res.json({
      success: true,

      records,

      stats: {
        totalStock:
          totalStock[0]?.total || 0,

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
    Get Single Water Distribution
========================================== */

export const getWaterDistribution = async (
  req,
  res
) => {
  try {
    const distribution =
      await WaterDistribution.findOne({
        _id: req.params.id,
        ngo: req.user.id,
      })
        .populate({
          path: "volunteer",
          populate: {
            path: "user",
            select: "name mobile email",
          },
        });

    if (!distribution) {
      return res.status(404).json({
        success: false,
        message:
          "Water distribution record not found.",
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
    Update Water Distribution
========================================== */

export const updateWaterDistribution =
  async (req, res) => {
    try {
      const distribution =
        await WaterDistribution.findOneAndUpdate(
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
            "Water distribution record not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Water distribution updated successfully.",
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
    Delete Water Distribution
========================================== */

export const deleteWaterDistribution =
  async (req, res) => {
    try {
      const distribution =
        await WaterDistribution.findOneAndDelete({
          _id: req.params.id,
          ngo: req.user.id,
        });

      if (!distribution) {
        return res.status(404).json({
          success: false,
          message:
            "Water distribution record not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Water distribution deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

