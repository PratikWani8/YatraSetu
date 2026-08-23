import Pilgrim from "../models/Pilgrim.js";
import QRScan from "../models/QRScan.js";
import Volunteer from "../models/Volunteer.js";
import WaterDistribution from "../models/WaterDistribution.js";
import FoodDistribution from "../models/FoodDistribution.js";
import Hospital from "../models/Hospital.js";
import MissingPerson from "../models/MissingPerson.js";

export const getVolunteerDashboard = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({
      user: req.user._id,
    });

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer profile not found.",
      });
    }

    const [
      registeredPilgrims,
      qrScans,
      pendingWater,
      pendingFood,
      completedWater,
      completedFood,
      nearbyHospitals,
      missingPersons,
    ] = await Promise.all([
      /* Registered Pilgrims */
      Pilgrim.countDocuments(),

      /* QR Scans by Logged-in Volunteer */
      QRScan.countDocuments({
        scannedBy: req.user._id,
      }),

      /* Pending Water Assignments */
      WaterDistribution.countDocuments({
        volunteer: volunteer._id,
        status: "Pending",
      }),

      /* Pending Food Assignments */
      FoodDistribution.countDocuments({
        volunteer: volunteer._id,
        status: "Pending",
      }),

      /* Completed Water Assignments */
      WaterDistribution.countDocuments({
        volunteer: volunteer._id,
        status: "Completed",
      }),

      /* Completed Food Assignments */
      FoodDistribution.countDocuments({
        volunteer: volunteer._id,
        status: "Completed",
      }),

      /* Hospitals */
      Hospital.countDocuments({
        isActive: true,
        status: "Approved",
      }),

      /* Missing Persons (Active Cases) */
      MissingPerson.countDocuments({
        status: {
          $in: [
            "Reported",
            "Searching",
            "Police Assigned",
          ],
        },
      }),
    ]);

    const recentScans = await QRScan.find({
      scannedBy: req.user._id,
    })
      .populate(
        "pilgrim",
        "pilgrimId name mobile status"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5);

    const waterAssignments =
      await WaterDistribution.find({
        volunteer: volunteer._id,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5);

    const foodAssignments =
      await FoodDistribution.find({
        volunteer: volunteer._id,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5);

    const assignments = [
      ...waterAssignments.map((item) => ({
        ...item.toObject(),
        type: "Water",
      })),

      ...foodAssignments.map((item) => ({
        ...item.toObject(),
        type: "Food",
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);

    res.status(200).json({
      success: true,

      stats: {
        registeredPilgrims,

        qrScans,

        emergencies: 0, 

        missingPersons,

        pendingAssignments:
          pendingWater + pendingFood,

        completedAssignments:
          completedWater + completedFood,

        nearbyHospitals,

        nearbyPoliceStations: 0, 
      },

      recentScans,

      recentAssignments: assignments,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};