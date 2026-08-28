import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NGOSidebar from "../../components/ngo/NGOSidebar";

import {
  Search,
  RefreshCcw,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UtensilsCrossed,
  Package,
  Users,
  X,
  Eye,
  MapPin,
} from "lucide-react";

import API from "../../services/api";
import { BASE_URL } from "../../api/api";

export default function FoodDistribution() {
  /* ==========================================
      States
  ========================================== */

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalPackets: 0,
    distributedToday: 0,
    activeVolunteers: 0,
    camps: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const [filters, setFilters] = useState({
    search: "",
    sector: "",
    status: "",
    page: 1,
    limit: 10,
  });

  /* ==========================================
      Modal States
========================================== */

const [showModal, setShowModal] =
  useState(false);

const [submitting, setSubmitting] =
  useState(false);

const [volunteerOptions, setVolunteerOptions] =
  useState([]);

const [formData, setFormData] =
  useState({
    campName: "",
    location: "",
    sector: "",
    foodPackets: "",
    meals: "",
    volunteer: "",
    status: "Pending",
    notes: "",
  });

  /* ==========================================
      Fetch Food Distribution
  ========================================== */

  const fetchFoodDistribution = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/ngo/food-distribution",
        {
          params: filters,
        }
      );

      setRecords(res.data.records || []);

      setStats(
        res.data.stats || {
          totalPackets: 0,
          distributedToday: 0,
          activeVolunteers: 0,
          camps: 0,
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
  fetchFoodDistribution();
}, [filters]);

useEffect(() => {
  fetchVolunteerOptions();
}, []);

  /* ==========================================
      Handlers
  ========================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      page: 1,
      [name]: value,
    }));
  };

  const handleRefresh = () => {
    setFilters({
      search: "",
      sector: "",
      status: "",
      page: 1,
      limit: 10,
    });
  };

  /* ==========================================
      Modal Handlers
========================================== */

const openModal = () => {
  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);

  setFormData({
    campName: "",
    location: "",
    sector: "",
    foodPackets: "",
    meals: "",
    volunteer: "",
    status: "Pending",
    notes: "",
  });
};

const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async () => {
  try {
    if (
      !formData.campName ||
      !formData.location ||
      !formData.sector ||
      !formData.foodPackets ||
      !formData.meals
    ) {
      return alert(
        "Please fill all required fields."
      );
    }

    setSubmitting(true);

    await API.post(
      "/ngo/food-distribution",
      formData
    );

    closeModal();

    fetchFoodDistribution();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        "Failed to create food distribution."
    );
  } finally {
    setSubmitting(false);
  }
};

const fetchVolunteerOptions = async () => {
  try {
    const res = await API.get(
      "/ngo/volunteers",
      {
        params: {
          limit: 1000,
        },
      }
    );

    setVolunteerOptions(
      res.data.volunteers || []
    );
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}

      <NGOSidebar />

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
                Food Distribution
              </h1>

              <p className="mt-2 text-gray-500">
                Manage food packet distribution,
                volunteers and camps.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow transition hover:bg-gray-100"
              >
                <RefreshCcw size={18} />

                Refresh
              </button>

              <button
                 onClick={openModal}
                 className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
                >
                 <Plus size={18} />
                New Distribution
            </button>
            </div>
          </div>

          {/* ======================================
                Statistics
          ====================================== */}

          <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Total Food Packets
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-orange-600">
                    {stats.totalPackets}
                  </h2>
                </div>

                <div className="rounded-2xl bg-orange-100 p-4">
                  <UtensilsCrossed
                    size={32}
                    className="text-orange-600"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Distributed Today
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-green-600">
                    {stats.distributedToday}
                  </h2>
                </div>

                <div className="rounded-2xl bg-green-100 p-4">
                  <Package
                    size={32}
                    className="text-green-600"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Active Volunteers
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-violet-600">
                    {stats.activeVolunteers}
                  </h2>
                </div>

                <div className="rounded-2xl bg-violet-100 p-4">
                  <Users
                    size={32}
                    className="text-violet-600"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Distribution Camps
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-red-600">
                    {stats.camps}
                  </h2>
                </div>

                <div className="rounded-2xl bg-red-100 p-4">
                  <MapPin
                    size={32}
                    className="text-red-600"
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
              <Filter className="text-orange-600" />

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
                  placeholder="Search camp..."
                  className="w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-orange-500"
                />
              </div>

              {/* Sector */}

              <div className="relative">
                <select
                  name="sector"
                  value={filters.sector}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="">
                    All Sectors
                  </option>

                  <option>
                    Sector A
                  </option>

                  <option>
                    Sector B
                  </option>

                  <option>
                    Sector C
                  </option>

                  <option>
                    Sector D
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
                  className="w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="">
                    All Status
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Pending">
                    Pending
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
                Food Distribution Table
          ====================================== */}

          <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="hide-scrollbar overflow-x-auto">
              <table className="w-full min-w-[1400px]">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Distribution ID
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Camp
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Sector
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Food Packets
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Meals
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Volunteer
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Date & Time
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
                  {/* Loading */}

                  {loading &&
                    [...Array(10)].map((_, index) => (
                      <tr key={index} className="border-b">
                        <td colSpan={9} className="p-6">
                          <div className="h-14 animate-pulse rounded-xl bg-gray-200"></div>
                        </td>
                      </tr>
                    ))}

                  {/* Records */}

                  {!loading &&
                    records.length > 0 &&
                    records.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b transition hover:bg-orange-50"
                      >
                        {/* Distribution ID */}

                        <td className="px-6 py-5 font-semibold text-orange-600">
                          {item.distributionId}
                        </td>

                        {/* Camp */}

                        <td className="px-6 py-5">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {item.campName}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {item.location}
                            </p>
                          </div>
                        </td>

                        {/* Sector */}

                        <td className="w-48 px-6 py-5">
                          <span className="inline-block min-w-[130px] rounded-full bg-orange-100 px-4 py-2 text-center text-sm font-semibold text-orange-700">
                            {item.sector}
                          </span>
                        </td>

                        {/* Food Packets */}

                        <td className="w-44 px-6 py-5">
                          <div className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-full bg-orange-100 px-4 py-2">
                            <Package
                              size={16}
                              className="text-orange-600"
                            />

                            <span className="font-semibold text-orange-700">
                              {item.foodPackets}
                            </span>
                          </div>
                        </td>

                        {/* Meals */}

                        <td className="w-44 px-6 py-5">
                          <div className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-full bg-green-100 px-4 py-2">
                            <UtensilsCrossed
                              size={16}
                              className="text-green-600"
                            />

                            <span className="font-semibold text-green-700">
                              {item.meals}
                            </span>
                          </div>
                        </td>

                        {/* Volunteer */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {item.volunteer?.profilePhoto ? (
                              <img
                                 src={`${BASE_URL}/uploads/volunteers/${item.volunteer.profilePhoto}`}
                                 alt={item.volunteer?.user?.name}
                                 className="h-12 w-12 rounded-full border object-cover"
                                />
                                ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                               {item.volunteer?.user?.name
                               ?.charAt(0)
                               ?.toUpperCase()}
                            </div>
                              )}

                            <div>
                              <h4 className="font-semibold">
                                {
                                  item.volunteer?.user
                                    ?.name
                                }
                              </h4>

                              <p className="text-sm text-gray-500">
                                {
                                  item.volunteer?.user
                                    ?.mobile
                                }
                              </p>

                              <p className="text-xs text-orange-600">
                                {
                                  item.volunteer
                                    ?.volunteerId
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}

                        <td className="px-6 py-5 pl-12">
                          <div>
                            <p className="font-medium">
                              {new Date(
                                item.distributedAt
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
                                item.distributedAt
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
                            className={`inline-flex min-w-[150px] items-center justify-center rounded-full px-5 py-2 text-sm font-semibold ${
                              item.status ===
                              "Completed"
                                ? "bg-green-100 text-green-700"
                                : item.status ===
                                  "In Progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <button className="rounded-xl bg-orange-100 p-3 text-orange-700 transition hover:bg-orange-600 hover:text-white">
                              <Eye size={18} />
                            </button>

                            <button className="rounded-xl bg-green-100 p-3 text-green-700 transition hover:bg-green-600 hover:text-white">
                              <Users size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* Empty */}
                  {!loading &&
                    records.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="py-20 text-center"
                        >
                          <div className="flex flex-col items-center">
                            <UtensilsCrossed
                              size={70}
                              className="mb-4 text-orange-300"
                            />

                            <h3 className="text-2xl font-bold text-gray-700">
                              No Food Distribution
                              Records
                            </h3>

                            <p className="mt-2 max-w-md text-gray-500">
                              No food distribution
                              records found for the
                              selected filters.
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
        Pagination
====================================== */}

{!loading && pagination.totalPages > 0 && (
  <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg">
    <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
      {/* Showing Results */}

      <div>
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-orange-600">
            {(pagination.page - 1) *
              pagination.limit +
              1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-orange-600">
            {Math.min(
              pagination.page *
                pagination.limit,
              pagination.total
            )}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-orange-600">
            {pagination.total}
          </span>{" "}
          food distribution records
        </p>
      </div>

      {/* Pagination */}

      <div className="flex items-center gap-2">
        {/* Previous */}

        <button
          disabled={pagination.page === 1}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              page: prev.page - 1,
            }))
          }
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition ${
            pagination.page === 1
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "hover:border-orange-600 hover:bg-orange-600 hover:text-white"
          }`}
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {/* Page Numbers */}

        {Array.from(
          {
            length:
              pagination.totalPages,
          },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page,
              }))
            }
            className={`h-11 w-11 rounded-xl font-semibold transition ${
              pagination.page === page
                ? "bg-orange-600 text-white shadow-md"
                : "border bg-white hover:bg-orange-100"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}

        <button
          disabled={
            pagination.page ===
            pagination.totalPages
          }
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              page: prev.page + 1,
            }))
          }
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition ${
            pagination.page ===
            pagination.totalPages
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "hover:border-orange-600 hover:bg-orange-600 hover:text-white"
          }`}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  </div>
)}

    {/* ======================================
      New Food Distribution Modal
====================================== */}

{showModal && (
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
            New Food Distribution
          </h2>

          <p className="text-gray-500">
            Create a new food
            distribution record.
          </p>
        </div>

        <button
          onClick={closeModal}
          className="rounded-xl p-2 transition hover:bg-gray-100"
        >
          <X />
        </button>
      </div>

      {/* Form */}

      <div className="grid gap-5 p-6 md:grid-cols-2">
        {/* Camp */}

        <div>
          <label className="mb-2 block font-medium">
            Camp Name
          </label>

          <input
            type="text"
            name="campName"
            value={formData.campName}
            onChange={handleInputChange}
            placeholder="Camp Name"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        {/* Location */}

        <div>
          <label className="mb-2 block font-medium">
            Location
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        {/* Sector */}

        <div>
          <label className="mb-2 block font-medium">
            Sector
          </label>

          <select
            name="sector"
            value={formData.sector}
            onChange={handleInputChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
          >
            <option value="">
              Select Sector
            </option>

            <option>
              Sector A
            </option>

            <option>
              Sector B
            </option>

            <option>
              Sector C
            </option>

            <option>
              Sector D
            </option>
          </select>
        </div>

        {/* Food Packets */}

        <div>
          <label className="mb-2 block font-medium">
            Food Packets
          </label>

          <input
            type="number"
            name="foodPackets"
            value={formData.foodPackets}
            onChange={handleInputChange}
            placeholder="250"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        {/* Meals */}

        <div>
          <label className="mb-2 block font-medium">
            Meals
          </label>

          <input
            type="number"
            name="meals"
            value={formData.meals}
            onChange={handleInputChange}
            placeholder="500"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

                {/* Volunteer */}

        <div>
          <label className="mb-2 block font-medium">
            Assign Volunteer
          </label>

          <select
            name="volunteer"
            value={formData.volunteer}
            onChange={handleInputChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
          >
            <option value="">
              Select Volunteer
            </option>

            {volunteerOptions.map((volunteer) => (
              <option
                key={volunteer._id}
                value={volunteer._id}
              >
                {volunteer.user?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}

        <div>
          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
          >
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
        </div>

        {/* Notes */}

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Notes
          </label>

          <textarea
            rows={4}
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional Notes..."
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t p-6">
        <button
          onClick={closeModal}
          className="rounded-xl border px-6 py-3 font-medium transition hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Creating..."
            : "Create Distribution"}
        </button>
      </div>
    </motion.div>
  </div>
)}

        </motion.div>
      </main>
    </div>
  );
}