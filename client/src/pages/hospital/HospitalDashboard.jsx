import { motion } from "framer-motion";
import {
  Users,
  BedDouble,
  Ambulance,
  Activity,
  HeartPulse,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

import HospitalSidebar from "../../components/hospital/HospitalSidebar";

export default function HospitalDashboard() {
  const stats = [
    {
      title: "Patients Today",
      value: 186,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      change: "+18 Today",
    },
    {
      title: "Available Beds",
      value: 42,
      icon: BedDouble,
      color: "from-green-500 to-green-600",
      change: "12 ICU Free",
    },
    {
      title: "Ambulances",
      value: 8,
      icon: Ambulance,
      color: "from-orange-500 to-orange-600",
      change: "2 Active",
    },
    {
      title: "Critical Cases",
      value: 14,
      icon: HeartPulse,
      color: "from-red-500 to-red-600",
      change: "Needs Attention",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <HospitalSidebar />

      {/* Main Content */}

      <main className="hide-scrollbar flex-1 overflow-y-auto p-6 lg:p-8">

        {/* Welcome */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-red-700 p-8 text-white shadow-xl"
        >

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div>

              <h1 className="text-4xl font-black">
                Welcome Back 👨‍⚕️
              </h1>

              <p className="mt-3 max-w-2xl text-red-100">
                Monitor patient health, manage emergency
                cases, assign ambulances, and provide
                quality healthcare during the pilgrimage.
              </p>

            </div>

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
              }}
              className="rounded-2xl bg-white/15 p-5 backdrop-blur-lg"
            >

              <ShieldAlert size={55} />

            </motion.div>

          </div>

        </motion.div>

        {/* Statistics */}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
                className="rounded-2xl bg-white p-6 shadow-lg transition-all"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-gray-500">
                      {item.title}
                    </p>

                    <h2 className="mt-2 text-4xl font-black text-gray-800">
                      {item.value}
                    </h2>

                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-600">

                      <ArrowUpRight size={16} />

                      {item.change}

                    </div>

                  </div>

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                  >

                    <Icon size={34} />

                  </div>

                </div>

              </motion.div>
            );
          })}

        </div>

                {/* Quick Actions & Emergency Alerts */}

        <div className="mt-8 grid gap-6 xl:grid-cols-3">

          {/* Quick Actions */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-lg"
          >

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Quick Actions
                </h2>

                <p className="text-sm text-gray-500">
                  Frequently used hospital operations
                </p>

              </div>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {[
                {
                  title: "Scan QR",
                  icon: "📷",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  title: "Add Diagnosis",
                  icon: "🩺",
                  color: "from-green-500 to-green-600",
                },
                {
                  title: "Prescription",
                  icon: "💊",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  title: "Request Ambulance",
                  icon: "🚑",
                  color: "from-red-500 to-red-600",
                },
                {
                  title: "Admit Patient",
                  icon: "🏥",
                  color: "from-orange-500 to-orange-600",
                },
                {
                  title: "Discharge",
                  icon: "✅",
                  color: "from-teal-500 to-teal-600",
                },
              ].map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{
                    scale: 1.04,
                    y: -5,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  className={`rounded-2xl bg-gradient-to-r ${item.color} p-6 text-left text-white shadow-lg`}
                >

                  <div className="text-4xl">
                    {item.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/80">
                    Open module
                  </p>

                </motion.button>
              ))}

            </div>

          </motion.div>

          {/* Emergency Alerts */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold text-gray-800">
                Emergency Alerts
              </h2>

              <Activity className="text-red-600" />

            </div>

            <div className="space-y-4">

              {[
                {
                  patient: "Rajesh Sharma",
                  issue: "Cardiac Arrest",
                  color: "bg-red-500",
                },
                {
                  patient: "Anita Patel",
                  issue: "Heat Stroke",
                  color: "bg-orange-500",
                },
                {
                  patient: "Vijay Kumar",
                  issue: "Accident Injury",
                  color: "bg-yellow-500",
                },
                {
                  patient: "Sunita Devi",
                  issue: "Severe Dehydration",
                  color: "bg-blue-500",
                },
              ].map((alert, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 rounded-xl border border-red-100 p-4 transition"
                >

                  <div
                    className={`h-4 w-4 rounded-full ${alert.color} animate-pulse`}
                  />

                  <div className="flex-1">

                    <h4 className="font-bold text-gray-800">
                      {alert.patient}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {alert.issue}
                    </p>

                  </div>

                  <button className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">
                    View
                  </button>

                </motion.div>
              ))}

            </div>

          </motion.div>

        </div>

                {/* Recent Patients & Bed Availability */}

        <div className="mt-8 grid gap-6 xl:grid-cols-3">

          {/* Recent Patients */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-2 rounded-2xl bg-white shadow-lg"
          >

            <div className="flex items-center justify-between border-b p-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Patients
                </h2>

                <p className="text-sm text-gray-500">
                  Latest admitted and treated pilgrims
                </p>

              </div>

              <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                View All
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr className="text-left text-sm font-semibold text-gray-600">

                    <th className="px-6 py-4">Patient</th>

                    <th className="px-6 py-4">Age</th>

                    <th className="px-6 py-4">Blood</th>

                    <th className="px-6 py-4">Condition</th>

                    <th className="px-6 py-4">Status</th>

                    <th className="px-6 py-4">Action</th>

                  </tr>

                </thead>

                <tbody>

                  {[
                    {
                      name: "Rajesh Sharma",
                      age: 52,
                      blood: "B+",
                      condition: "Heart Attack",
                      status: "Critical",
                    },
                    {
                      name: "Anita Patel",
                      age: 33,
                      blood: "O+",
                      condition: "Heat Stroke",
                      status: "Stable",
                    },
                    {
                      name: "Vijay Kumar",
                      age: 44,
                      blood: "A+",
                      condition: "Fracture",
                      status: "Recovering",
                    },
                    {
                      name: "Sunita Devi",
                      age: 60,
                      blood: "AB+",
                      condition: "Dehydration",
                      status: "Stable",
                    },
                    {
                      name: "Ramesh Joshi",
                      age: 47,
                      blood: "O-",
                      condition: "Accident",
                      status: "Critical",
                    },
                  ].map((patient, index) => (

                    <tr
                      key={index}
                      className="border-b transition hover:bg-red-50"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">

                            {patient.name.charAt(0)}

                          </div>

                          <div>

                            <h4 className="font-semibold text-gray-800">
                              {patient.name}
                            </h4>

                            <p className="text-sm text-gray-500">
                              PID-{1000 + index}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5">
                        {patient.age}
                      </td>

                      <td className="px-6 py-5">
                        {patient.blood}
                      </td>

                      <td className="px-6 py-5">
                        {patient.condition}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                            patient.status === "Critical"
                              ? "bg-red-600"
                              : patient.status === "Stable"
                              ? "bg-green-600"
                              : "bg-blue-600"
                          }`}
                        >
                          {patient.status}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </motion.div>

          {/* Bed Availability */}

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >

            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Bed Availability
            </h2>

            {[
              {
                ward: "General Ward",
                total: 120,
                available: 34,
                color: "bg-green-500",
              },
              {
                ward: "ICU",
                total: 20,
                available: 5,
                color: "bg-red-500",
              },
              {
                ward: "Emergency",
                total: 40,
                available: 11,
                color: "bg-orange-500",
              },
              {
                ward: "Observation",
                total: 30,
                available: 14,
                color: "bg-blue-500",
              },
            ].map((bed, index) => (

              <div
                key={index}
                className="mb-5"
              >

                <div className="mb-2 flex items-center justify-between">

                  <span className="font-semibold">
                    {bed.ward}
                  </span>

                  <span className="text-sm text-gray-500">
                    {bed.available}/{bed.total}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                  <div
                    className={`${bed.color} h-full rounded-full`}
                    style={{
                      width: `${(bed.available / bed.total) * 100}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </motion.div>

        </div>

                {/* Ambulance Requests & Recent Activities */}

        <div className="mt-8 grid gap-6 xl:grid-cols-3">

          {/* Ambulance Requests */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-lg"
          >

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Ambulance Requests
                </h2>

                <p className="text-sm text-gray-500">
                  Active emergency transportation requests
                </p>

              </div>

              <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                View All
              </button>

            </div>

            <div className="space-y-4">

              {[
                {
                  patient: "Rajesh Sharma",
                  location: "Gate A - Sector 4",
                  priority: "Critical",
                  ambulance: "AMB-001",
                },
                {
                  patient: "Anita Patel",
                  location: "Camp 7",
                  priority: "Medium",
                  ambulance: "AMB-004",
                },
                {
                  patient: "Vijay Kumar",
                  location: "Medical Camp 2",
                  priority: "High",
                  ambulance: "AMB-002",
                },
              ].map((item, index) => (

                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className="flex flex-col gap-4 rounded-xl border border-gray-100 p-5 transition md:flex-row md:items-center md:justify-between"
                >

                  <div>

                    <h3 className="text-lg font-bold text-gray-800">
                      {item.patient}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.location}
                    </p>

                  </div>

                  <div className="flex items-center gap-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                        item.priority === "Critical"
                          ? "bg-red-600"
                          : item.priority === "High"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {item.priority}
                    </span>

                    <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold">
                      {item.ambulance}
                    </span>

                    <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                      Track
                    </button>

                  </div>

                </motion.div>

              ))}

            </div>

          </motion.div>

          {/* Recent Activities */}

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >

            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Recent Activities
            </h2>

            <div className="space-y-6">

              {[
                {
                  title: "Patient Admitted",
                  description: "Rajesh Sharma admitted to ICU",
                  time: "5 min ago",
                  color: "bg-red-500",
                },
                {
                  title: "Diagnosis Added",
                  description: "Heat stroke treatment updated",
                  time: "18 min ago",
                  color: "bg-green-500",
                },
                {
                  title: "Prescription Issued",
                  description: "Medicines prescribed successfully",
                  time: "42 min ago",
                  color: "bg-blue-500",
                },
                {
                  title: "Patient Discharged",
                  description: "Recovery completed successfully",
                  time: "1 hour ago",
                  color: "bg-purple-500",
                },
              ].map((activity, index) => (

                <div
                  key={index}
                  className="relative flex gap-4"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`h-4 w-4 rounded-full ${activity.color}`}
                    />

                    {index !== 3 && (
                      <div className="mt-2 h-12 w-0.5 bg-gray-200" />
                    )}

                  </div>

                  <div>

                    <h4 className="font-semibold text-gray-800">
                      {activity.title}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                      {activity.description}
                    </p>

                    <span className="mt-2 inline-block text-xs text-gray-400">
                      {activity.time}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </motion.div>

        </div>

      </main>

    </div>
  );
}