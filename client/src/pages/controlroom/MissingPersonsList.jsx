import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket";

import VolunteerSidebar from "../../components/volunteer/VolunteerSidebar";
import MissingStats from "../../components/missing/MissingStats";
import MissingFilters from "../../components/missing/MissingFilters";
import MissingCard from "../../components/missing/MissingCard";
import MissingDetailsModal from "../../components/missing/MissingDetailsModal";

import {
  Search,
  Users,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Bell,
} from "lucide-react";

import toast from "react-hot-toast";

export default function MissingPersonsList() {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");
 
  const [sort, setSort] = useState("newest");

  const [selectedReport, setSelectedReport] =
  useState(null);

const [assignReport, setAssignReport] =
  useState(null);

const [foundReport, setFoundReport] =
  useState(null);

  const [priority, setPriority] =
    useState("");

  const [stats, setStats] = useState({
    total: 0,
    searching: 0,
    critical: 0,
    found: 0,
  });

  const [connected, setConnected] =
    useState(false);

  /* ======================================
          Load Reports
  ====================================== */

  const loadReports = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/missing-persons",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search,
            status,
            priority,
          },
        }
      );

      setReports(res.data.reports);
    } catch (err) {
      console.log(err);
    }
  };

  /* ======================================
          Statistics
  ====================================== */

  const loadStatistics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/missing-persons/statistics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data.statistics);
    } catch (err) {
      console.log(err);
    }
  };

  /* ======================================
          Initial Load
  ====================================== */

  useEffect(() => {
    Promise.all([
      loadReports(),
      loadStatistics(),
    ]).finally(() => setLoading(false));
  }, [search, status, priority]);

  /* ======================================
          Socket.IO
  ====================================== */

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    /* -------------------------
       New Missing Report
    ------------------------- */

    socket.on("missing:new", (report) => {
      setReports((prev) => [
        report,
        ...prev,
      ]);

      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        searching:
          prev.searching + 1,
        critical:
          report.priority ===
          "Critical"
            ? prev.critical + 1
            : prev.critical,
      }));

      toast.success(
        `🚨 ${report.pilgrimName} reported missing`
      );
    });

    /* -------------------------
       Status Changed
    ------------------------- */

    socket.on(
      "missing:status",
      (updated) => {
        setReports((prev) =>
          prev.map((item) =>
            item._id === updated._id
              ? updated
              : item
          )
        );

        loadStatistics();
      }
    );

    /* -------------------------
       Police Assigned
    ------------------------- */

    socket.on(
      "missing:assigned",
      (updated) => {
        setReports((prev) =>
          prev.map((item) =>
            item._id === updated._id
              ? updated
              : item
          )
        );
      }
    );

    /* -------------------------
       Person Found
    ------------------------- */

    socket.on(
      "missing:found",
      (updated) => {
        setReports((prev) =>
          prev.map((item) =>
            item._id === updated._id
              ? updated
              : item
          )
        );

        loadStatistics();
      }
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");

      socket.off("missing:new");

      socket.off("missing:status");

      socket.off("missing:assigned");

      socket.off("missing:found");
    };
  }, []);

  return (
    <div className="flex bg-slate-100 min-h-screen">

      <VolunteerSidebar />

      <main className="flex-1 p-8">

        {/* ===============================
                HEADER
        =============================== */}

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="text-4xl font-black">

              Missing Persons

            </h1>

            <p className="text-slate-500 mt-2">

              Emergency Command Center

            </p>

          </div>

          <div className="flex items-center gap-4">

            <div
              className={`flex items-center gap-2 rounded-full px-5 py-3 font-semibold ${
                connected
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >

              <Radio
                size={18}
                className="animate-pulse"
              />

              {connected
                ? "LIVE"
                : "OFFLINE"}

            </div>

            <button className="relative rounded-full bg-white p-4 shadow">

              <Bell />

              <span className="absolute right-2 top-2 h-3 w-3 rounded-full bg-red-500 animate-ping"/>

            </button>

          </div>

        </div>

        {/* ===============================
              Statistics
        =============================== */}

        <MissingStats stats={stats} />

        {/* ===============================
              Search + Filters
        =============================== */}

        <MissingFilters
  search={search}
  setSearch={setSearch}
  status={status}
  setStatus={setStatus}
  priority={priority}
  setPriority={setPriority}
  sort={sort}
  setSort={setSort}
/>

        {
            

<div className="grid gap-6 mt-8 xl:grid-cols-2">

  {loading ? (

    <div className="col-span-full py-20 text-center">

      <h2 className="text-xl font-semibold">

        Loading Reports...

      </h2>

    </div>

  ) : reports.length === 0 ? (

    <div className="col-span-full rounded-3xl bg-white p-16 shadow text-center">

      <AlertTriangle
        size={70}
        className="mx-auto text-slate-300"
      />

      <h2 className="mt-5 text-2xl font-bold">

        No Missing Reports

      </h2>

      <p className="mt-2 text-slate-500">

        New reports will appear automatically.

      </p>

    </div>

  ) : (

    <div className="grid gap-6 mt-8 xl:grid-cols-2">

  {reports.map((report) => (

    <MissingCard
      key={report._id}
      report={report}
      onView={setSelectedReport}
      onAssign={setAssignReport}
      onFound={setFoundReport}
    />

  ))}

</div>

  )}

</div>
        }

      </main>
      <MissingDetailsModal
  open={!!selectedReport}
  report={selectedReport}
  onClose={() => setSelectedReport(null)}
/>

    </div>
  );
}