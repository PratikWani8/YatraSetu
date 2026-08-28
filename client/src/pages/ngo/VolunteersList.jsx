import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCcw,
  Users,
  Eye,
  Phone,
  MapPin,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Filter,
} from "lucide-react";
import NGOSidebar from "../../components/ngo/NGOSidebar";
import API from "../../services/api";
import { BASE_URL } from "../../api/api";

export default function VolunteersList() {
  const navigate = useNavigate();

  /* ==========================================
      States
  ========================================== */

  const [volunteers, setVolunteers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const [filters, setFilters] = useState({
    search: "",
    zone: "",
    role: "",
    sort: "newest",
    page: 1,
    limit: 10,
  });

  /* ==========================================
      Fetch Volunteers
  ========================================== */

  const fetchVolunteers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/ngo/volunteers", {
        params: filters,
      });

      setVolunteers(res.data.volunteers || []);

      setPagination(
        res.data.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
          limit: 10,
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [filters]);

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
      zone: "",
      role: "",
      sort: "newest",
      page: 1,
      limit: 10,
    });
  };

  const handlePage = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const badgeColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";

      case "Busy":
        return "bg-yellow-100 text-yellow-700";

      case "Offline":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* ==========================================
      Pagination Numbers
  ========================================== */

  const getPages = () => {
    const pages = [];

    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <NGOSidebar />

     <div className="flex-1 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gray-50 p-6"
      >
      {/* ======================================
            Header
      ====================================== */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            NGO Volunteers
          </h1>

          <p className="mt-2 text-gray-500">
            Search, filter and manage all registered volunteers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-100 px-5 py-3">
            <div className="flex items-center gap-3">
              <Users className="text-violet-700" />

              <div>
                <p className="text-xs text-gray-500">
                  Total Volunteers
                </p>

                <h3 className="text-xl font-bold text-violet-700">
                  {pagination.total}
                </h3>
              </div>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* ======================================
            Filter Card
      ====================================== */}

      <div className="mb-6 rounded-3xl bg-white p-6 shadow-lg">
        <div className="mb-5 flex items-center gap-2">
          <Filter className="text-violet-600" />

          <h2 className="text-lg font-semibold">
            Search & Filters
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
              placeholder="Search name, email or mobile"
              className="w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-violet-500"
            />
          </div>

          {/* Zone */}

          <select
            name="zone"
            value={filters.zone}
            onChange={handleChange}
            className="rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-violet-500"
          >
            <option value="">All Zones</option>
            <option value="Sector A">Sector A</option>
            <option value="Sector B">Sector B</option>
            <option value="Sector C">Sector C</option>
            <option value="Sector D">Sector D</option>
          </select>

          {/* Role */}

          <select
            name="role"
            value={filters.role}
            onChange={handleChange}
            className="rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-violet-500"
          >
            <option value="">All Roles</option>
            <option value="General Volunteer">
              General Volunteer
            </option>
            <option value="Rescue Volunteer">
              Rescue Volunteer
            </option>
            <option value="Food Volunteer">
              Food Volunteer
            </option>
            <option value="Medical Volunteer">
              Medical Volunteer
            </option>
            <option value="Water Volunteer">
              Water Volunteer
            </option>
            <option value="Crowd Volunteer">
              Crowd Volunteer
            </option>
          </select>

          {/* Sort */}

          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-violet-500"
          >
            <option value="newest">Newest</option>
            <option value="name">Name</option>
            <option value="availability">
              Availability
            </option>
          </select>
        </div>
      </div>

            {/* ======================================
              Volunteers Table
      ====================================== */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-violet-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Volunteer
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Contact
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Assigned Zone
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Volunteer Role
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Availability
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {/* ===============================
                      Loading
              ================================ */}

              {loading &&
                [...Array(10)].map((_, index) => (
                  <tr key={index} className="border-b">
                    <td colSpan={6} className="p-6">
                      <div className="h-14 animate-pulse rounded-xl bg-gray-200" />
                    </td>
                  </tr>
                ))}

              {/* ===============================
                      Volunteers
              ================================ */}

              {!loading &&
                volunteers.length > 0 &&
                volunteers.map((volunteer) => (
                  <tr
                    key={volunteer._id}
                    className="border-b transition duration-200 hover:bg-violet-50"
                  >
                    {/* Volunteer */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {volunteer.profilePhoto ? (
                          <img
  src={`${BASE_URL}/uploads/volunteers/${volunteer.profilePhoto}`}
  alt={volunteer.user?.name}
  className="h-14 w-14 rounded-full border object-cover"
/>
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">
                            {volunteer.user?.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>
                        )}

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {volunteer.user?.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {volunteer.user?.email}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ID : {volunteer.volunteerId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}

                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone
                            size={16}
                            className="text-violet-600"
                          />

                          <span className="text-sm">
                            {volunteer.user?.mobile}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500">
                          {volunteer.address?.city || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Zone */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={16}
                          className="text-red-500"
                        />

                        <span>
                          {volunteer.assignedZone ||
                            "Not Assigned"}
                        </span>
                      </div>
                    </td>

                    {/* Role */}

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                        {volunteer.volunteerRole ||
                          "General Volunteer"}
                      </span>
                    </td>

                    {/* Availability */}

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${badgeColor(
                          volunteer.availability
                        )}`}
                      >
                        <BadgeCheck size={15} />

                        {volunteer.availability ||
                          "Unavailable"}
                      </span>
                    </td>

                    {/* Action */}

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/ngo/volunteers/${volunteer._id}`
                            )
                          }
                          className="rounded-xl bg-violet-100 p-3 text-violet-700 transition hover:bg-violet-600 hover:text-white"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          className="rounded-xl bg-green-100 p-3 text-green-700 transition hover:bg-green-600 hover:text-white"
                        >
                          <Phone size={18} />
                        </button>

                        <button
                          className="rounded-xl bg-blue-100 p-3 text-blue-700 transition hover:bg-blue-600 hover:text-white"
                        >
                          <UserCheck size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* ===============================
                    Empty State
              ================================ */}

              {!loading &&
                volunteers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-20 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <Users
                          size={70}
                          className="mb-4 text-gray-300"
                        />

                        <h3 className="text-2xl font-bold text-gray-700">
                          No Volunteers Found
                        </h3>

                        <p className="mt-2 max-w-md text-gray-500">
                          No volunteer records matched
                          your search or filters.
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
            {/* Left */}

            <div>
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-violet-600">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-violet-600">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-violet-600">
                  {pagination.total}
                </span>{" "}
                volunteers
              </p>
            </div>

            {/* Right */}

            <div className="flex items-center gap-2">
              {/* Previous */}

              <button
                disabled={pagination.page === 1}
                onClick={() =>
                  handlePage(pagination.page - 1)
                }
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition ${
                  pagination.page === 1
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "hover:border-violet-600 hover:bg-violet-600 hover:text-white"
                }`}
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              {/* Page Numbers */}

              {getPages().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePage(page)}
                  className={`h-11 w-11 rounded-xl font-semibold transition ${
                    pagination.page === page
                      ? "bg-violet-600 text-white shadow-md"
                      : "border bg-white hover:bg-violet-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next */}

              <button
                disabled={
                  pagination.page === pagination.totalPages
                }
                onClick={() =>
                  handlePage(pagination.page + 1)
                }
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition ${
                  pagination.page ===
                  pagination.totalPages
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "hover:border-violet-600 hover:bg-violet-600 hover:text-white"
                }`}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
    </div>
    </div>
  );
}