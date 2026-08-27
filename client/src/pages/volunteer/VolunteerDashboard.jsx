import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import API from "../../services/api";
import VolunteerSidebar from "../../components/volunteer/VolunteerSidebar";
import StatCard from "../../components/volunteer/StatCard";
import QuickActionCard from "../../components/volunteer/QuickActionCard";
import FloatingSOS from "../../components/volunteer/FloatingSOS";

import {
  UserPlus,
  QrCode,
  Ambulance,
  Search,
  Users,
  Hospital,
  ShieldAlert,
  ClipboardList,
  CheckCircle,
  Activity,
} from "lucide-react";

const VolunteerDashboard = () => {
  const [stats, setStats] = useState({
    registeredPilgrims: 0,
    qrScans: 0,
    emergencies: 0,
    missingPersons: 0,
    pendingAssignments: 0,
    completedAssignments: 0,
    nearbyHospitals: 0,
    nearbyPoliceStations: 0,
  });

  useEffect(() => {
  fetchDashboard();

  const interval = setInterval(() => {
    fetchDashboard();
  }, 10000);

  return () => clearInterval(interval);
}, []);

  const fetchDashboard = async () => {
  try {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const res = await API.get(
      "/volunteer/dashboard",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStats(res.data.stats);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        {/* Sidebar */}
        <VolunteerSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Volunteer Dashboard
              </h1>

              <p className="mt-2 text-slate-500">
                Welcome back 👋 Manage pilgrims, emergencies and field
                operations.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-5 py-4 shadow">
              <p className="text-sm text-slate-500">Today's Date</p>

              <h3 className="font-semibold text-slate-800">
                {new Date().toDateString()}
              </h3>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="Registered Pilgrims"
              value={stats.registeredPilgrims}
              color="bg-blue-500"
              icon={<UserPlus size={28} />}
            />

            <StatCard
              title="QR Scans"
              value={stats.qrScans}
              color="bg-purple-500"
              icon={<QrCode size={28} />}
            />

            <StatCard
              title="Medical Emergencies"
              value={stats.emergencies}
              color="bg-red-500"
              icon={<Ambulance size={28} />}
            />

            <StatCard
              title="Missing Persons"
              value={stats.missingPersons}
              color="bg-orange-500"
              icon={<Search size={28} />}
            />

            <StatCard
              title="Pending Assignments"
              value={stats.pendingAssignments}
              color="bg-indigo-500"
              icon={<ClipboardList size={28} />}
            />

            <StatCard
              title="Completed Tasks"
              value={stats.completedAssignments}
              color="bg-green-500"
              icon={<CheckCircle size={28} />}
            />

            <StatCard
              title="Nearby Hospitals"
              value={stats.nearbyHospitals}
              color="bg-teal-500"
              icon={<Hospital size={28} />}
            />

            <StatCard
              title="Nearby Police Stations"
              value={stats.nearbyPoliceStations}
              color="bg-yellow-500"
              icon={<ShieldAlert size={28} />}
            />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <div className="mb-5 flex items-center gap-2">
              <Activity className="text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                Quick Actions
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <QuickActionCard
                title="Register Pilgrim"
                description="Register new pilgrims quickly."
                icon={<UserPlus size={34} />}
                color="bg-blue-100"
                link="/volunteer/register-pilgrim"
              />

              <QuickActionCard
                title="Scan QR"
                description="Scan pilgrim QR card."
                icon={<QrCode size={34} />}
                color="bg-purple-100"
                link="/volunteer/scan-qr"
              />

              <QuickActionCard
                title="Medical Emergency"
                description="Report medical incidents."
                icon={<Ambulance size={34} />}
                color="bg-red-100"
                link="/volunteer/medical-emergency"
              />

              <QuickActionCard
                title="Missing Person"
                description="Create missing person report."
                icon={<Search size={34} />}
                color="bg-orange-100"
                link="/volunteer/missing-person"
              />

              <QuickActionCard
                title="Crowd Issues"
                description="Report overcrowded areas."
                icon={<Users size={34} />}
                color="bg-yellow-100"
                link="/volunteer/crowd-issues"
              />

              <QuickActionCard
                title="Nearby Hospitals"
                description="Find nearby hospitals."
                icon={<Hospital size={34} />}
                color="bg-teal-100"
                link="/volunteer/dashboard/hospitals"
              />
            </div>
          </motion.div>
        </main>
      </div>

      {/* Floating SOS */}
      <FloatingSOS />
    </div>
  );
};

export default VolunteerDashboard;