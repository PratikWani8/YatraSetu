import Volunteer from "../models/Volunteer.js";
import WaterDistribution from "../models/WaterDistribution.js";
import FoodDistribution from "../models/FoodDistribution.js";

export const getOverview = async (req, res) => {
  try {
    const totalVolunteers =
      await Volunteer.countDocuments();

    const waterResult =
      await WaterDistribution.aggregate([
        {
          $group: {
            _id: null,

            totalWater: {
              $sum: "$quantity",
            },

            completedWater: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "Completed",
                    ],
                  },
                  "$quantity",
                  0,
                ],
              },
            },

            totalCenters: {
              $addToSet:
                "$campName",
            },
          },
        },
      ]);

    const foodResult =
      await FoodDistribution.aggregate([
        {
          $group: {
            _id: null,

            totalPackets: {
              $sum:
                "$foodPackets",
            },

            completedPackets: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "Completed",
                    ],
                  },
                  "$foodPackets",
                  0,
                ],
              },
            },

            totalFoodCenters: {
              $addToSet:
                "$campName",
            },
          },
        },
      ]);

    const completedWaterTasks =
      await WaterDistribution.countDocuments(
        {
          status:
            "Completed",
        }
      );

    const completedFoodTasks =
      await FoodDistribution.countDocuments(
        {
          status:
            "Completed",
        }
      );

    const pendingWater =
      await WaterDistribution.countDocuments(
        {
          status:
            "Pending",
        }
      );

    const pendingFood =
      await FoodDistribution.countDocuments(
        {
          status:
            "Pending",
        }
      );

    const water =
      waterResult.length > 0
        ? waterResult[0]
        : {
            totalWater: 0,
            completedWater: 0,
            totalCenters: [],
          };

    const food =
      foodResult.length > 0
        ? foodResult[0]
        : {
            totalPackets: 0,
            completedPackets: 0,
            totalFoodCenters: [],
          };

    const centers = new Set([
      ...(water.totalCenters || []),
      ...(food.totalFoodCenters || []),
    ]);

    const totalTasks =
      completedWaterTasks +
      completedFoodTasks +
      pendingWater +
      pendingFood;

    const completedTasks =
      completedWaterTasks +
      completedFoodTasks;

    const pendingTasks =
      pendingWater +
      pendingFood;

    const completionRate =
      totalTasks === 0
        ? 0
        : Number(
            (
              (completedTasks /
                totalTasks) *
              100
            ).toFixed(1)
          );

    return res.status(200).json({
      success: true,

      stats: {
        totalVolunteers,

        waterDistributed:
          water.totalWater || 0,

        completedWater:
          water.completedWater || 0,

        foodPackets:
          food.totalPackets || 0,

        completedFoodPackets:
          food.completedPackets || 0,

        distributionCenters:
          centers.size,

        completedTasks,

        pendingTasks,

        totalTasks,

        completionRate,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch report overview.",
      error: error.message,
    });
  }
};

export const getCharts = async (req, res) => {
  try {
    const { duration = "30days" } = req.query;

    let startDate = new Date();

    switch (duration) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;

      case "7days":
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;

      case "30days":
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        break;

      case "90days":
        startDate.setDate(startDate.getDate() - 89);
        startDate.setHours(0, 0, 0, 0);
        break;

      case "year":
        startDate = new Date(
          startDate.getFullYear(),
          0,
          1
        );
        break;

      default:
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
    }

    const waterTrend =
      await WaterDistribution.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },

            water: {
              $sum: "$quantity",
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    const foodTrend =
      await FoodDistribution.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },

            food: {
              $sum: "$foodPackets",
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    const trendMap = new Map();

    /* Water */
    waterTrend.forEach((item) => {
      trendMap.set(item._id, {
        day: item._id,
        water: item.water,
        food: 0,
      });
    });

    /* Food */
    foodTrend.forEach((item) => {
      if (trendMap.has(item._id)) {
        trendMap.get(item._id).food =
          item.food;
      } else {
        trendMap.set(item._id, {
          day: item._id,
          water: 0,
          food: item.food,
        });
      }
    });

    const distributionTrend = Array.from(
      trendMap.values()
    ).sort(
      (a, b) =>
        new Date(a.day) -
        new Date(b.day)
    );

    const waterComparison =
      await WaterDistribution.aggregate([
        {
          $group: {
            _id: "$sector",

            water: {
              $sum: "$quantity",
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    const foodComparison =
      await FoodDistribution.aggregate([
        {
          $group: {
            _id: "$sector",

            food: {
              $sum: "$foodPackets",
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    const comparisonMap = new Map();

    waterComparison.forEach(
      (item) => {
        comparisonMap.set(
          item._id,
          {
            category:
              item._id ||
              "Unknown",

            water:
              item.water,

            food: 0,
          }
        );
      }
    );

    foodComparison.forEach(
      (item) => {
        if (
          comparisonMap.has(
            item._id
          )
        ) {
          comparisonMap.get(
            item._id
          ).food =
            item.food;
        } else {
          comparisonMap.set(
            item._id,
            {
              category:
                item._id ||
                "Unknown",

              water: 0,

              food:
                item.food,
            }
          );
        }
      }
    );

    const comparison =
      Array.from(
        comparisonMap.values()
      );

        /* ======================================
        Task Status
    ====================================== */

    const waterStatus =
      await WaterDistribution.aggregate([
        {
          $group: {
            _id: "$status",

            total: {
              $sum: 1,
            },
          },
        },
      ]);

    const foodStatus =
      await FoodDistribution.aggregate([
        {
          $group: {
            _id: "$status",

            total: {
              $sum: 1,
            },
          },
        },
      ]);

    const statusMap = new Map();

    waterStatus.forEach((item) => {
      statusMap.set(item._id, item.total);
    });

    foodStatus.forEach((item) => {
      statusMap.set(
        item._id,
        (statusMap.get(item._id) || 0) +
          item.total
      );
    });

    const taskStatus = Array.from(
      statusMap.entries()
    ).map(([name, value]) => ({
      name,
      value,
    }));

    /* ======================================
        Sector Distribution
    ====================================== */

    const waterSector =
      await WaterDistribution.aggregate([
        {
          $group: {
            _id: "$sector",

            total: {
              $sum: "$quantity",
            },
          },
        },
      ]);

    const foodSector =
      await FoodDistribution.aggregate([
        {
          $group: {
            _id: "$sector",

            total: {
              $sum: "$foodPackets",
            },
          },
        },
      ]);

    const sectorMap = new Map();

    waterSector.forEach((item) => {
      sectorMap.set(item._id, item.total);
    });

    foodSector.forEach((item) => {
      sectorMap.set(
        item._id,
        (sectorMap.get(item._id) || 0) +
          item.total
      );
    });

    const sectorDistribution =
      Array.from(
        sectorMap.entries()
      )
        .map(
          ([sector, total]) => ({
            sector:
              sector ||
              "Unknown",

            total,
          })
        )
        .sort(
          (a, b) =>
            b.total - a.total
        );

    /* ======================================
        Top Volunteers
    ====================================== */

    const topVolunteers =
      await Volunteer.aggregate([
        {
          $lookup: {
            from:
              "waterdistributions",

            localField: "_id",

            foreignField:
              "volunteer",

            as: "waterTasks",
          },
        },
        {
          $lookup: {
            from:
              "fooddistributions",

            localField: "_id",

            foreignField:
              "volunteer",

            as: "foodTasks",
          },
        },
        {
          $project: {
            profilePhoto: 1,

            user: 1,

            completed: {
              $add: [
                {
                  $size: {
                    $filter: {
                      input:
                        "$waterTasks",

                      as: "task",

                      cond: {
                        $eq: [
                          "$$task.status",
                          "Completed",
                        ],
                      },
                    },
                  },
                },

                {
                  $size: {
                    $filter: {
                      input:
                        "$foodTasks",

                      as: "task",

                      cond: {
                        $eq: [
                          "$$task.status",
                          "Completed",
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: "users",

            localField: "user",

            foreignField: "_id",

            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $sort: {
            completed: -1,
          },
        },
        {
          $limit: 10,
        },
        {
          $project: {
            name: "$user.name",

            profilePhoto: 1,

            completed: 1,
          },
        },
      ]);

        /* ======================================
        Monthly Distribution Trend
    ====================================== */

    const waterMonthly =
      await WaterDistribution.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            water: {
              $sum: "$quantity",
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    const foodMonthly =
      await FoodDistribution.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            food: {
              $sum: "$foodPackets",
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    /* ======================================
        Merge Monthly Trend
    ====================================== */

    const monthMap =
      new Map();

    waterMonthly.forEach(
      (item) => {
        const key = `${item._id.year}-${item._id.month}`;

        monthMap.set(key, {
          month: new Date(
            item._id.year,
            item._id.month - 1
          ).toLocaleString(
            "default",
            {
              month: "short",
            }
          ),

          water:
            item.water,

          food: 0,

          total:
            item.water,
        });
      }
    );

    foodMonthly.forEach(
      (item) => {
        const key = `${item._id.year}-${item._id.month}`;

        if (
          monthMap.has(key)
        ) {
          const data =
            monthMap.get(key);

          data.food =
            item.food;

          data.total +=
            item.food;
        } else {
          monthMap.set(key, {
            month: new Date(
              item._id.year,
              item._id.month - 1
            ).toLocaleString(
              "default",
              {
                month: "short",
              }
            ),

            water: 0,

            food:
              item.food,

            total:
              item.food,
          });
        }
      }
    );

    const monthlyTrend =
      Array.from(
        monthMap.values()
      );

    /* ======================================
        Response
    ====================================== */

    return res.status(200).json({
      success: true,

      distributionTrend,

      comparison,

      taskStatus,

      sectorDistribution,

      topVolunteers,

      monthlyTrend,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message:
        "Failed to load report charts.",

      error:
        error.message,
    });
  }
};

/* ==========================================
      Recent Activities
========================================== */

export const getRecentActivities = async (
  req,
  res
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    /* ======================================
        Water Activities
    ====================================== */

    const waterActivities =
      await WaterDistribution.find()
        .populate({
          path: "volunteer",
          select:
            "profilePhoto user",
          populate: {
            path: "user",
            select:
              "name mobile",
          },
        })
        .sort({
          createdAt: -1,
        })
        .lean();

    /* ======================================
        Food Activities
    ====================================== */

    const foodActivities =
      await FoodDistribution.find()
        .populate({
          path: "volunteer",
          select:
            "profilePhoto user",
          populate: {
            path: "user",
            select:
              "name mobile",
          },
        })
        .sort({
          createdAt: -1,
        })
        .lean();

    /* ======================================
        Format Water
    ====================================== */

    const water =
      waterActivities.map(
        (item) => ({
          ...item,

          type: "Water",

          quantity:
            item.quantity,

          foodPackets: 0,
        })
      );

    /* ======================================
        Format Food
    ====================================== */

    const food =
      foodActivities.map(
        (item) => ({
          ...item,

          type: "Food",

          quantity: 0,

          foodPackets:
            item.foodPackets,
        })
      );

        /* ======================================
        Merge Activities
    ====================================== */

    let activities = [
      ...water,
      ...food,
    ];

    /* ======================================
        Search
    ====================================== */

    if (search) {
      const keyword =
        search.toLowerCase();

      activities =
        activities.filter(
          (item) =>
            item.campName
              ?.toLowerCase()
              .includes(keyword) ||
            item.location
              ?.toLowerCase()
              .includes(keyword) ||
            item.distributionId
              ?.toLowerCase()
              .includes(keyword) ||
            item.volunteer?.user?.name
              ?.toLowerCase()
              .includes(keyword)
        );
    }

    /* ======================================
        Latest First
    ====================================== */

    activities.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    /* ======================================
        Pagination
    ====================================== */

    const currentPage =
      Number(page);

    const pageLimit =
      Number(limit);

    const total =
      activities.length;

    const startIndex =
      (currentPage - 1) *
      pageLimit;

    const endIndex =
      startIndex + pageLimit;

    const paginatedActivities =
      activities.slice(
        startIndex,
        endIndex
      );

    /* ======================================
        Response
    ====================================== */

    return res.status(200).json({
      success: true,

      activities:
        paginatedActivities,

      pagination: {
        page: currentPage,

        limit: pageLimit,

        total,

        totalPages: Math.ceil(
          total / pageLimit
        ),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch recent activities.",

      error:
        error.message,
    });
  }
};