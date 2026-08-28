import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NGOSidebar from "../../components/ngo/NGOSidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  BarChart3,
  Calendar,
  Download,
  RefreshCcw,
  Filter,
  Search,
  Users,
  Droplets,
  UtensilsCrossed,
  HeartPulse,
  MapPin,
  Eye,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

import API from "../../services/api";
import { BASE_URL } from "../../api/api";

export default function NGOReports() {
  /* ==========================================
      States
  ========================================== */

  const [loading, setLoading] =
    useState(true);

  const [reportData, setReportData] =
    useState(null);

  const [filters, setFilters] =
    useState({
      duration: "30days",
      type: "all",
      search: "",
    });

    /* ==========================================
    Export State
========================================== */

const [exporting, setExporting] =
  useState(false);

  /* ==========================================
      Fetch Reports
  ========================================== */

  const fetchReports = async () => {
  try {
    setLoading(true);

    const [
      overviewRes,
      chartsRes,
      activityRes,
    ] = await Promise.all([
      API.get("/ngo/reports/overview"),

      API.get(
        "/ngo/reports/charts",
        {
          params: {
            duration:
              filters.duration,
          },
        }
      ),

      API.get(
        "/ngo/reports/recent-activities",
        {
          params: {
            search:
              filters.search,
          },
        }
      ),
    ]);

    setReportData({
      stats:
        overviewRes.data.stats,

      distributionTrend:
        chartsRes.data
          .distributionTrend,

      comparison:
        chartsRes.data
          .comparison,

      taskStatus:
        chartsRes.data
          .taskStatus,

      sectorDistribution:
        chartsRes.data
          .sectorDistribution,

      topVolunteers:
        chartsRes.data
          .topVolunteers,

      monthlyTrend:
        chartsRes.data
          .monthlyTrend,

      activities:
        activityRes.data
          .activities,
    });
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReports();
  }, [filters]);

  /* ==========================================
      Handlers
  ========================================== */

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRefresh = () => {
    fetchReports();
  };

  /* ==========================================
      Export PDF
========================================== */

const exportPDF = async () => {
  try {
    setExporting(true);

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "NGO Reports",
      14,
      18
    );

    doc.setFontSize(11);

    doc.text(
      `Generated : ${new Date().toLocaleString()}`,
      14,
      28
    );

    const rows =
      activities?.map(
        (item) => [
          item.type,

          item.distributionId,

          item.volunteer?.user
            ?.name,

          item.location,

          item.status,

          new Date(
            item.createdAt
          ).toLocaleDateString(),
        ]
      ) || [];

    autoTable(doc, {
      head: [
        [
          "Type",
          "Distribution ID",
          "Volunteer",
          "Location",
          "Status",
          "Date",
        ],
      ],

      body: rows,

      startY: 40,
    });

    doc.save(
      "ngo-report.pdf"
    );
  } catch (error) {
    console.error(error);
  } finally {
    setExporting(false);
  }
};

/* ==========================================
      Export Excel
========================================== */

const exportExcel = () => {
  try {
    setExporting(true);

    const excelData =
      activities?.map(
        (item) => ({
          Type: item.type,

          Distribution:
            item.distributionId,

          Volunteer:
            item.volunteer?.user
              ?.name,

          Location:
            item.location,

          Sector:
            item.sector,

          Quantity:
            item.quantity ||
            item.foodPackets,

          Status:
            item.status,

          Date:
            new Date(
              item.createdAt
            ).toLocaleString(),
        })
      ) || [];

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Reports"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const file = new Blob(
      [excelBuffer],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(
      file,
      "ngo-report.xlsx"
    );
  } catch (error) {
    console.error(error);
  } finally {
    setExporting(false);
  }
};

/* ==========================================
      Print
========================================== */

const printReport = () => {
  window.print();
};

  /* ==========================================
    Statistics Cards
========================================== */

const stats = [
  {
    title: "Total Volunteers",
    value:
      reportData?.stats
        ?.totalVolunteers ?? 0,
    icon: Users,
    color: "bg-violet-100",
    text: "text-violet-600",
  },

  {
    title: "Water Distributed",
    value: `${
      reportData?.stats
        ?.waterDistributed ?? 0
    } L`,
    icon: Droplets,
    color: "bg-cyan-100",
    text: "text-cyan-600",
  },

  {
    title: "Food Packets",
    value:
      reportData?.stats
        ?.foodPackets ?? 0,
    icon: UtensilsCrossed,
    color: "bg-orange-100",
    text: "text-orange-600",
  },

  {
    title: "Medical Camps",
    value:
      reportData?.stats
        ?.medicalCamps ?? 0,
    icon: HeartPulse,
    color: "bg-red-100",
    text: "text-red-600",
  },

  {
    title: "Distribution Centers",
    value:
      reportData?.stats
        ?.distributionCenters ??
      0,
    icon: MapPin,
    color: "bg-green-100",
    text: "text-green-600",
  },

  {
    title: "Completed Tasks",
    value:
      reportData?.stats
        ?.completedTasks ?? 0,
    icon: CheckCircle2,
    color: "bg-blue-100",
    text: "text-blue-600",
  },
];

  const distributionTrend =
  reportData?.distributionTrend || [];

  const comparisonData =
  reportData?.comparison || [];

  const taskStatus =
  reportData?.taskStatus || [];

  const sectorDistribution =
  reportData?.sectorDistribution || [];

  const activities =
  reportData?.activities || [];

const COLORS = [
  "#22C55E",
  "#FACC15",
  "#EF4444",
];

const topVolunteers =
  reportData?.topVolunteers || [];

const monthlyTrend =
  reportData?.monthlyTrend || [];

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
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-3">
                  <BarChart3
                    size={28}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Reports &
                    Analytics
                  </h1>

                  <p className="mt-1 text-gray-500">
                    Monitor NGO
                    performance,
                    volunteer
                    activities and
                    distribution
                    analytics.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={
                  handleRefresh
                }
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow transition hover:bg-gray-100"
              >
                <RefreshCcw
                  size={18}
                />

                Refresh
              </button>

              <button className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700">
                <Download
                  size={18}
                />

                Export Report
              </button>
            </div>
          </div>

          {/* ======================================
                  Filters
          ====================================== */}

          <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex items-center gap-2">
              <Filter className="text-blue-600" />

              <h2 className="text-lg font-semibold">
                Report Filters
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
                  value={
                    filters.search
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Search..."
                  className="w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                />
              </div>

              {/* Duration */}

              <div className="relative">
                <select
                  name="duration"
                  value={
                    filters.duration
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="today">
                    Today
                  </option>

                  <option value="7days">
                    Last 7 Days
                  </option>

                  <option value="30days">
                    Last 30 Days
                  </option>

                  <option value="90days">
                    Last 90 Days
                  </option>

                  <option value="year">
                    This Year
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>

              {/* Report Type */}

              <div className="relative">
                <select
                  name="type"
                  value={
                    filters.type
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="all">
                    All Reports
                  </option>

                  <option value="water">
                    Water
                    Distribution
                  </option>

                  <option value="food">
                    Food
                    Distribution
                  </option>

                  <option value="volunteers">
                    Volunteers
                  </option>

                  <option value="medical">
                    Medical Camps
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>

              {/* Calendar */}

              <div className="flex items-center justify-center rounded-xl border bg-blue-50 px-4 py-3">
                <Calendar
                  size={18}
                  className="mr-2 text-blue-600"
                />

                <span className="font-medium text-blue-700">
                  Live Analytics
                </span>
              </div>
            </div>
          </div>

          {/* ======================================
        Statistics
====================================== */}

<div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
  {stats.map(
    (item, index) => {
      const Icon = item.icon;

      return (
        <motion.div
          key={item.title}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay:
              index * 0.08,
          }}
          whileHover={{
            y: -5,
            scale: 1.02,
          }}
          className="rounded-3xl bg-white p-6 shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {item.title}
              </p>

              {loading ? (
                <div className="mt-3 h-10 w-24 animate-pulse rounded bg-gray-200"></div>
              ) : (
                <h2 className="mt-2 text-4xl font-black text-gray-800">
                  {item.value}
                </h2>
              )}
            </div>

            <div
              className={`rounded-2xl ${item.color} p-4`}
            >
              <Icon
                size={34}
                className={item.text}
              />
            </div>
          </div>
        </motion.div>
      );
    }
  )}
</div>

{/* ======================================
        Distribution Trend
====================================== */}

<motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  className="mb-8 rounded-3xl bg-white p-6 shadow-lg"
>
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">
        Distribution Trend
      </h2>

      <p className="text-gray-500">
        Daily water and food distribution.
      </p>
    </div>
  </div>

  <div className="h-[420px]">
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <LineChart
        data={distributionTrend}
      >
        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis dataKey="day" />

        <YAxis />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="water"
          stroke="#06B6D4"
          strokeWidth={4}
          dot={{
            r: 5,
          }}
          activeDot={{
            r: 8,
          }}
          name="Water (L)"
        />

        <Line
          type="monotone"
          dataKey="food"
          stroke="#F97316"
          strokeWidth={4}
          dot={{
            r: 5,
          }}
          activeDot={{
            r: 8,
          }}
          name="Food Packets"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</motion.div>

{/* ======================================
        Water vs Food Comparison
====================================== */}

<motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  className="mb-8 rounded-3xl bg-white p-6 shadow-lg"
>
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Water vs Food Distribution
    </h2>

    <p className="text-gray-500">
      Compare distribution across sectors.
    </p>
  </div>

  <div className="h-[420px]">
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <BarChart
        data={comparisonData}
      >
        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="category"
        />

        <YAxis />

        <Tooltip />

        <Legend />

        <Bar
          dataKey="water"
          fill="#06B6D4"
          radius={[
            8, 8, 0, 0,
          ]}
          name="Water (L)"
        />

        <Bar
          dataKey="food"
          fill="#F97316"
          radius={[
            8, 8, 0, 0,
          ]}
          name="Food Packets"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</motion.div>

{/* ======================================
      Task Status & Sector Distribution
====================================== */}

<div className="mb-8 grid gap-8 xl:grid-cols-2">
  {/* ==============================
        Task Status
  ============================== */}

  <motion.div
    initial={{
      opacity: 0,
      y: 20,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    className="rounded-3xl bg-white p-6 shadow-lg"
  >
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Task Status
      </h2>

      <p className="text-gray-500">
        Overall assignment completion.
      </p>
    </div>

    <div className="h-[360px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={taskStatus}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >
            {taskStatus.map(
              (entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </motion.div>

  {/* ==============================
        Sector Distribution
  ============================== */}

  <motion.div
    initial={{
      opacity: 0,
      y: 20,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    className="rounded-3xl bg-white p-6 shadow-lg"
  >
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Sector Distribution
      </h2>

      <p className="text-gray-500">
        Distribution performed
        in each sector.
      </p>
    </div>

    <div className="h-[360px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={
            sectorDistribution
          }
          layout="vertical"
        >
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            type="number"
          />

          <YAxis
            type="category"
            dataKey="sector"
            width={80}
          />

          <Tooltip />

          <Bar
            dataKey="total"
            fill="#3B82F6"
            radius={[
              0,
              8,
              8,
              0,
            ]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
</div>

{/* ======================================
      Volunteer Performance
====================================== */}

<div className="mb-8 grid gap-8 xl:grid-cols-2">
  {/* =============================
        Top Volunteers
  ============================= */}

  <motion.div
    initial={{
      opacity: 0,
      y: 20,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    className="rounded-3xl bg-white p-6 shadow-lg"
  >
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Top Volunteers
      </h2>

      <p className="text-gray-500">
        Highest completed
        assignments.
      </p>
    </div>

    <div className="h-[360px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          layout="vertical"
          data={topVolunteers}
        >
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            type="number"
          />

          <YAxis
            type="category"
            width={80}
            dataKey="name"
          />

          <Tooltip />

          <Bar
            dataKey="completed"
            fill="#8B5CF6"
            radius={[
              0,
              8,
              8,
              0,
            ]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </motion.div>

  {/* =============================
        Monthly Trend
  ============================= */}

  <motion.div
    initial={{
      opacity: 0,
      y: 20,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    className="rounded-3xl bg-white p-6 shadow-lg"
  >
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Monthly Distribution
      </h2>

      <p className="text-gray-500">
        Overall NGO distribution
        trend.
      </p>
    </div>

    <div className="h-[360px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={monthlyTrend}
        >
          <defs>
            <linearGradient
              id="colorDistribution"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#3B82F6"
                stopOpacity={0.8}
              />

              <stop
                offset="95%"
                stopColor="#3B82F6"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
          />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="total"
            stroke="#3B82F6"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorDistribution)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
</div>

    {/* ======================================
      Export Toolbar
====================================== */}

<motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  className="mb-8 rounded-3xl bg-white p-6 shadow-lg"
>
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">
        Export Reports
      </h2>

      <p className="mt-1 text-gray-500">
        Download analytics reports or print
        them for offline use.
      </p>
    </div>

    <div className="flex flex-wrap gap-4">
      {/* PDF */}

      <button
        onClick={exportPDF}
        disabled={exporting}
        className="flex items-center gap-3 rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FileText size={20} />

        {exporting
          ? "Exporting..."
          : "Export PDF"}
      </button>

      {/* Excel */}

      <button
        onClick={exportExcel}
        disabled={exporting}
        className="flex items-center gap-3 rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FileSpreadsheet size={20} />

        {exporting
          ? "Exporting..."
          : "Export Excel"}
      </button>

      {/* Print */}

      <button
        onClick={printReport}
        className="flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
      >
        <Printer size={20} />

        Print Report
      </button>
    </div>
  </div>
</motion.div>

    {/* ======================================
        Recent Activities
====================================== */}

<motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  className="mb-8 rounded-3xl bg-white shadow-lg"
>
  {/* Header */}

  <div className="flex items-center justify-between border-b p-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">
        Recent Activities
      </h2>

      <p className="mt-1 text-gray-500">
        Latest NGO distribution activities.
      </p>
    </div>

    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
      {activities?.length || 0} Records
    </span>
  </div>

  {/* Table */}

  <div className="hide-scrollbar overflow-x-auto">
    <table className="min-w-[1700px] w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left font-semibold">
            Activity
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Volunteer
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Distribution
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Location
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Quantity
          </th>

          <th className="px-6 py-4 text-left font-semibold">
            Date
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
              Loading
        ============================ */}

        {loading &&
          [...Array(8)].map((_, index) => (
            <tr
              key={index}
              className="border-b"
            >
              <td
                colSpan={8}
                className="p-6"
              >
                <div className="h-16 animate-pulse rounded-2xl bg-gray-200"></div>
              </td>
            </tr>
          ))}

        {/* ============================
              Activities
        ============================ */}

        {!loading &&
          activities?.map(
            (activity) => (
              <tr
                key={activity._id}
                className="border-b transition hover:bg-blue-50"
              >
                {/* =====================================
      Activity
===================================== */}

<td className="px-6 py-5">
  {activity.type === "Water" ? (
    <span className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-cyan-100 px-4 py-2 font-semibold text-cyan-700">
      <Droplets size={18} />

      Water Distribution
    </span>
  ) : activity.type === "Food" ? (
    <span className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">
      <UtensilsCrossed size={18} />

      Food Distribution
    </span>
  ) : (
    <span className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">
      <HeartPulse size={18} />

      Medical Camp
    </span>
  )}
</td>

{/* =====================================
      Volunteer
===================================== */}

<td className="px-6 py-5">
  <div className="flex items-center gap-3">
    {activity.volunteer?.profilePhoto ? (
      <img
        src={`${BASE_URL}/uploads/volunteers/${activity.volunteer.profilePhoto}`}
        alt={activity.volunteer?.user?.name}
        className="h-12 w-12 rounded-full border object-cover"
      />
    ) : (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
        {activity.volunteer?.user?.name
          ?.charAt(0)
          ?.toUpperCase()}
      </div>
    )}

    <div>
      <h3 className="font-semibold">
        {activity.volunteer?.user?.name}
      </h3>

      <p className="text-sm text-gray-500">
        {activity.volunteer?.user?.mobile}
      </p>
    </div>
  </div>
</td>

{/* =====================================
      Distribution
===================================== */}

<td className="px-6 py-5">
  <div>
    <h4 className="font-semibold text-blue-600">
      {activity.distributionId}
    </h4>

    <p className="text-sm text-gray-500">
      {activity.campName}
    </p>
  </div>
</td>

{/* =====================================
      Location
===================================== */}

<td className="px-6 py-5">
  <div>
    <h4 className="font-semibold">
      {activity.location}
    </h4>

    <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
      {activity.sector}
    </span>
  </div>
</td>

{/* =====================================
      Quantity
===================================== */}

<td className="px-6 py-5">
  {activity.type === "Water" ? (
    <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 font-semibold text-cyan-700">
      <Droplets size={16} />

      {activity.quantity} L
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">
      <UtensilsCrossed size={16} />

      {activity.foodPackets} Packets
    </span>
  )}
</td>

{/* =====================================
      Date
===================================== */}

<td className="px-6 py-5">
  <div>
    <h4 className="font-semibold">
      {new Date(
        activity.createdAt
      ).toLocaleDateString("en-IN")}
    </h4>

    <p className="text-sm text-gray-500">
      {new Date(
        activity.createdAt
      ).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  </div>
</td>

{/* =====================================
      Status
===================================== */}

<td className="px-6 py-5">
  <span
    className={`inline-flex min-w-[140px] justify-center rounded-full px-4 py-2 text-sm font-semibold ${
      activity.status === "Completed"
        ? "bg-green-100 text-green-700"
        : activity.status === "In Progress"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {activity.status}
  </span>
</td>

{/* =====================================
      Action
===================================== */}

<td className="px-6 py-5">
  <div className="flex justify-center">
    <button className="rounded-xl bg-blue-100 p-3 text-blue-700 transition hover:bg-blue-600 hover:text-white">
      <Eye size={18} />
    </button>
  </div>
</td>

</tr>
))}

{/* =====================================
      Empty State
===================================== */}

{!loading &&
  activities?.length === 0 && (
    <tr>
      <td
        colSpan={8}
        className="py-20 text-center"
      >
        <ClipboardList
          size={70}
          className="mx-auto mb-5 text-gray-300"
        />

        <h3 className="text-2xl font-bold text-gray-700">
          No Recent Activities
        </h3>

        <p className="mt-2 text-gray-500">
          Activities will appear here after
          distributions are completed.
        </p>
      </td>
    </tr>
  )}

    </tbody>
</table>
</div>
</motion.div>

        </motion.div>
      </main>
    </div>
  );
}