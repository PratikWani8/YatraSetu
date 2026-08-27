import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VolunteerSidebar from "../../components/volunteer/VolunteerSidebar";

import {
  ClipboardList,
  Search,
  Filter,
  RefreshCcw,
  ChevronDown,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  PackageCheck,
  Droplets,
  UtensilsCrossed,
  AlertTriangle,
  X,
  Eye,
  HeartPulse,
} from "lucide-react";

import API from "../../services/api";

export default function VolunteerAssignments() {

  const [assignments, setAssignments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [pagination, setPagination] =
    useState({
      page: 1,
      totalPages: 1,
      total: 0,
      limit: 10,
    });

  const [filters, setFilters] =
    useState({
      search: "",
      type: "",
      status: "",
      page: 1,
      limit: 10,
    });

    /* ==========================================
      Assignment Modal
========================================== */

const [showAssignmentModal, setShowAssignmentModal] =
  useState(false);

const [selectedAssignment, setSelectedAssignment] =
  useState(null);

const [updatingStatus, setUpdatingStatus] =
  useState(false);

  /* ==========================================
      Fetch Assignments
  ========================================== */

  const fetchAssignments =
    async () => {
      try {
        setLoading(true);

        const res = await API.get(
          "/volunteer/assignments",
          {
            params: filters,
          }
        );

        setAssignments(
          res.data.assignments || []
        );

        setStats(
          res.data.stats || {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
          }
        );

        setPagination(
          res.data.pagination || {
            page: 1,
            totalPages: 1,
            total: 0,
            limit: 10,
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAssignments();
  }, [filters]);

  /* ==========================================
      Handlers
  ========================================== */

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFilters((prev) => ({
      ...prev,
      page: 1,
      [name]: value,
    }));
  };

  const handleRefresh = () => {
    setFilters({
      search: "",
      type: "",
      status: "",
      page: 1,
      limit: 10,
    });
  };

  /* ==========================================
      Assignment Handlers
========================================== */

const openAssignment = (
  assignment
) => {
  setSelectedAssignment(
    assignment
  );

  setShowAssignmentModal(true);
};

const closeAssignment = () => {
  setSelectedAssignment(null);

  setShowAssignmentModal(false);
};

/* ==========================================
      Update Assignment Status
========================================== */

const updateAssignmentStatus = async (
  assignment,
  status
) => {
  try {
    setUpdatingStatus(true);

    await API.patch(
      `/volunteer/assignments/${assignment._id}/status`,
      {
        status,
      }
    );

    fetchAssignments();

    if (
      selectedAssignment &&
      selectedAssignment._id === assignment._id
    ) {
      closeAssignment();
    }

    alert(`Assignment marked as ${status}.`);
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        "Failed to update assignment."
    );
  } finally {
    setUpdatingStatus(false);
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}

      <VolunteerSidebar />

      {/* Main */}

      <main className="hide-scrollbar flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          {/* ======================================
                  Header
          ====================================== */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                My Assignments
              </h1>

              <p className="mt-2 text-gray-500">
                View and complete your
                assigned NGO tasks.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow transition hover:bg-gray-100"
            >
              <RefreshCcw size={18} />

              Refresh
            </button>
          </div>

          {/* ======================================
                  Statistics
          ====================================== */}

          <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Total Tasks
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-blue-600">
                    {stats.total}
                  </h2>
                </div>

                <div className="rounded-2xl bg-blue-100 p-4">
                  <ClipboardList
                    size={30}
                    className="text-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-red-600">
                    {stats.pending}
                  </h2>
                </div>

                <div className="rounded-2xl bg-red-100 p-4">
                  <Clock3
                    size={30}
                    className="text-red-600"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    In Progress
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                    {stats.inProgress}
                  </h2>
                </div>

                <div className="rounded-2xl bg-yellow-100 p-4">
                  <LoaderCircle
                    size={30}
                    className="text-yellow-600"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Completed
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-green-600">
                    {stats.completed}
                  </h2>
                </div>

                <div className="rounded-2xl bg-green-100 p-4">
                  <CheckCircle2
                    size={30}
                    className="text-green-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================
                  Search & Filters
          ====================================== */}

          <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex items-center gap-2">
              <Filter className="text-blue-600" />

              <h2 className="text-lg font-semibold">
                Search & Filters
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {/* Search */}

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="Search Assignment..."
                  className="w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                />
              </div>

              {/* Assignment Type */}

              <div className="relative">
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">
                    All Assignment Types
                  </option>

                  <option value="Water">
                    💧 Water Distribution
                  </option>

                  <option value="Food">
                    🍱 Food Distribution
                  </option>

                  <option value="Medical">
                    🏥 Medical Camp
                  </option>

                  <option value="Crowd">
                    👥 Crowd Management
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>

              {/* Status */}

              <div className="relative">
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">
                    All Status
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* ======================================
        Assignment Table
====================================== */}

<div className="overflow-hidden rounded-3xl bg-white shadow-lg">
  <div className="hide-scrollbar overflow-x-auto">
    <table className="w-full min-w-[1600px]">
      <thead className="bg-blue-50">
        <tr>
          <th className="px-6 py-4 text-left font-semibold">
            Assignment
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Camp
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Location
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Volunteer
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Quantity
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Assigned On
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Status
          </th>

          <th className="px-6 py-4 text-center font-semibold">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        {/* ============================
              Loading Skeleton
        ============================ */}

        {loading &&
          [...Array(10)].map((_, index) => (
            <tr
              key={index}
              className="border-b"
            >
              <td
                colSpan={8}
                className="p-6"
              >
                <div className="h-14 animate-pulse rounded-xl bg-gray-200"></div>
              </td>
            </tr>
          ))}

        {/* ============================
              Assignment Rows
        ============================ */}

        {!loading &&
          assignments.length > 0 &&
          assignments.map(
            (assignment) => (
              <tr
                key={assignment._id}
                className="border-b transition hover:bg-blue-50"
              >
                                {/* Assignment Type */}

                <td className="w-56 px-6 py-5">
                  {assignment.type ===
                  "Water" ? (
                    <span className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-cyan-100 px-4 py-2 font-semibold text-cyan-700">
                      <Droplets size={18} />

                      Water Distribution
                    </span>
                  ) : assignment.type ===
                    "Food" ? (
                    <span className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">
                      <UtensilsCrossed
                        size={18}
                      />

                      Food Distribution
                    </span>
                  ) : (
                    <span className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">
                      <HeartPulse
                        size={18}
                      />

                      Medical Camp
                    </span>
                  )}
                </td>

                {/* Camp */}

                <td className="px-6 py-5">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {
                        assignment.campName
                      }
                    </h3>

                    <p className="text-sm text-gray-500">
                      ID :
                      {" "}
                      {
                        assignment.distributionId
                      }
                    </p>
                  </div>
                </td>

                {/* Location */}

                <td className="px-6 py-5">
                  <div>
                    <p className="font-medium">
                      {
                        assignment.location
                      }
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {
                        assignment.sector
                      }
                    </span>
                  </div>
                </td>
                                {/* Volunteer */}

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-semibold">
                        {
                          assignment.volunteer?.user
                            ?.name
                        }
                      </h4>

                      <p className="text-sm text-gray-500">
                        {
                          assignment.volunteer?.user
                            ?.mobile
                        }
                      </p>

                      <p className="text-xs text-blue-600">
                        {
                          assignment.volunteer
                            ?.volunteerId
                        }
                      </p>
                    </div>
                  </div>
                </td>

                {/* Quantity */}

                <td className="w-56 px-6 py-5">
                  {assignment.type ===
                  "Water" ? (
                    <span className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full bg-cyan-100 px-4 py-2 font-semibold text-cyan-700">
                      <Droplets size={16} />

                      {assignment.quantity} L
                    </span>
                  ) : assignment.type ===
                    "Food" ? (
                    <span className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">
                      <PackageCheck
                        size={16}
                      />

                      {
                        assignment.foodPackets
                      }{" "}
                      Packets
                    </span>
                  ) : (
                    <span className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">
                      <HeartPulse
                        size={16}
                      />

                      Medical Camp
                    </span>
                  )}
                </td>

                {/* Assigned Date */}

                <td className="px-6 py-5">
                  <div>
                    <p className="font-medium">
                      {new Date(
                        assignment.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        assignment.createdAt
                      ).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </td>

                {/* Status */}

                <td className="w-48 px-6 py-5">
                  <span
                    className={`inline-flex min-w-[150px] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold ${
                      assignment.status ===
                      "Completed"
                        ? "bg-green-100 text-green-700"
                        : assignment.status ===
                          "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </td>

                {/* Action */}

                <td className="px-6 py-5">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        openAssignment(
                          assignment
                        )
                      }
                      className="rounded-xl bg-blue-100 p-3 text-blue-700 transition hover:bg-blue-600 hover:text-white"
                    >
                      <Eye size={18} />
                    </button>

                    {assignment.status !==
                      "Completed" && (
                      <button
                       onClick={() =>
  updateAssignmentStatus(
    assignment,
    "Completed"
  )
}
                        className="rounded-xl bg-green-100 p-3 text-green-700 transition hover:bg-green-600 hover:text-white"
                      >
                        <CheckCircle2
                          size={18}
                        />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          )}

        {/* ============================
              Empty State
        ============================ */}

        {!loading &&
          assignments.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="py-20 text-center"
              >
                <div className="flex flex-col items-center">
                  <ClipboardList
                    size={70}
                    className="mb-4 text-blue-300"
                  />

                  <h3 className="text-2xl font-bold text-gray-700">
                    No Assignments Found
                  </h3>

                  <p className="mt-2 max-w-md text-gray-500">
                    You don't have any assigned
                    tasks matching the selected
                    filters.
                  </p>
                </div>
              </td>
            </tr>
          )}
      </tbody>
    </table>
  </div>
</div>

{/* ======================================
      Assignment Details Modal
====================================== */}

{showAssignmentModal &&
  selectedAssignment && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="hide-scrollbar max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold">
              Assignment Details
            </h2>

            <p className="mt-1 text-gray-500">
              Review your assigned task
              before updating its status.
            </p>
          </div>

          <button
            onClick={
              closeAssignment
            }
            className="rounded-xl p-2 transition hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        {/* Assignment Summary */}

        <div className="grid gap-5 p-6 md:grid-cols-2">
          {/* Assignment Type */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Assignment Type
            </p>

            {selectedAssignment.type ===
            "Water" ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 font-semibold text-cyan-700">
                <Droplets
                  size={18}
                />

                Water Distribution
              </span>
            ) : selectedAssignment.type ===
              "Food" ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">
                <UtensilsCrossed
                  size={18}
                />

                Food Distribution
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">
                <HeartPulse
                  size={18}
                />

                Medical Camp
              </span>
            )}
          </div>

          {/* Distribution ID */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Distribution ID
            </p>

            <h3 className="font-semibold text-blue-600">
              {
                selectedAssignment.distributionId
              }
            </h3>
          </div>

          {/* Camp */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Camp Name
            </p>

            <h3 className="font-semibold">
              {
                selectedAssignment.campName
              }
            </h3>
          </div>

          {/* Location */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Location
            </p>

            <h3 className="font-semibold">
              {
                selectedAssignment.location
              }
            </h3>
          </div>

          {/* Sector */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Sector
            </p>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {
                selectedAssignment.sector
              }
            </span>
          </div>

          {/* Status */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Current Status
            </p>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                selectedAssignment.status ===
                "Completed"
                  ? "bg-green-100 text-green-700"
                  : selectedAssignment.status ===
                    "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {
                selectedAssignment.status
              }
            </span>
          </div>

                    {/* Volunteer */}

          <div className="md:col-span-2">
            <p className="mb-3 text-sm font-medium text-gray-500">
              Assigned Volunteer
            </p>

            <div className="flex items-center gap-4 rounded-2xl border p-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedAssignment.volunteer?.user?.name}
                </h3>

                <p className="text-gray-500">
                  {selectedAssignment.volunteer?.user?.mobile}
                </p>

                <p className="text-sm font-medium text-blue-600">
                  {selectedAssignment.volunteer?.volunteerId}
                </p>
              </div>
            </div>
          </div>

          {/* Quantity */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Quantity
            </p>

            {selectedAssignment.type === "Water" ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-5 py-2 font-semibold text-cyan-700">
                <Droplets size={18} />

                {selectedAssignment.quantity} L
              </div>
            ) : selectedAssignment.type === "Food" ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 font-semibold text-orange-700">
                <PackageCheck size={18} />

                {selectedAssignment.foodPackets} Packets
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-5 py-2 font-semibold text-red-700">
                <HeartPulse size={18} />

                Medical Camp
              </div>
            )}
          </div>

          {/* Assigned On */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Assigned On
            </p>

            <h3 className="font-semibold">
              {new Date(
                selectedAssignment.createdAt
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h3>

            <p className="text-sm text-gray-500">
              {new Date(
                selectedAssignment.createdAt
              ).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Notes */}

          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium text-gray-500">
              Notes
            </p>

            <div className="rounded-2xl border bg-gray-50 p-4">
              {selectedAssignment.notes ||
                "No additional notes available."}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex flex-wrap justify-end gap-3 border-t p-6">
          <button
            onClick={closeAssignment}
            className="rounded-xl border px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Close
          </button>

          {selectedAssignment.status ===
            "Pending" && (
            <button
              onClick={() =>
                updateAssignmentStatus(
                  "In Progress"
                )
              }
              disabled={updatingStatus}
              className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-white transition hover:bg-yellow-600 disabled:opacity-60"
            >
              Mark In Progress
            </button>
          )}

          {selectedAssignment.status !==
            "Completed" && (
            <button
              onClick={() =>
  updateAssignmentStatus(
    selectedAssignment,
    "Completed"
  )
}
              disabled={updatingStatus}
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {updatingStatus
                ? "Updating..."
                : "Mark Completed"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
)}

{/* Footer */}
      <div className="flex items-center justify-between  bg-slate-50 px-6 py-4 mt-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <AlertTriangle size={16} />
          Keep your assignments updated regularly.
        </div>
        </div>
        </motion.div>
      </main>
    </div>
  );
}