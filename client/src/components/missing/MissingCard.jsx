import {
  Eye,
  Navigation,
  Shield,
  CheckCircle2,
  MapPin,
  Clock,
  User,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

export default function MissingCard({
  report,
  onView,
  onAssign,
  onFound,
}) {
  const priorityStyle = {
    Low: {
      badge: "bg-green-100 text-green-700",
      border: "border-green-500",
    },

    Medium: {
      badge: "bg-yellow-100 text-yellow-700",
      border: "border-yellow-500",
    },

    High: {
      badge: "bg-orange-100 text-orange-700",
      border: "border-orange-500",
    },

    Critical: {
      badge:
        "bg-red-100 text-red-700 animate-pulse",

      border:
        "border-red-600 animate-pulse",
    },
  };

  const statusStyle = {
    Reported:
      "bg-blue-100 text-blue-700",

    Searching:
      "bg-yellow-100 text-yellow-700",

    "Police Assigned":
      "bg-purple-100 text-purple-700",

    Found:
      "bg-green-100 text-green-700",

    Closed:
      "bg-slate-100 text-slate-700",
  };

  const getTimeAgo = (date) => {
    const diff =
      Math.floor(
        (Date.now() -
          new Date(date)) /
          1000
      );

    if (diff < 60)
      return `${diff}s ago`;

    if (diff < 3600)
      return `${Math.floor(
        diff / 60
      )} min ago`;

    if (diff < 86400)
      return `${Math.floor(
        diff / 3600
      )} hrs ago`;

    return `${Math.floor(
      diff / 86400
    )} days ago`;
  };

  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      className={`overflow-hidden rounded-3xl border-l-8 bg-white shadow-xl ${priorityStyle[
        report.priority
      ]?.border}`}
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b p-6">

        <div>

          <h2 className="text-2xl font-bold">

            {report.pilgrimName}

          </h2>

          <p className="mt-1 text-slate-500">

            {report.reportId}

          </p>

        </div>

        <div className="text-right space-y-2">

          <span
            className={`rounded-full px-4 py-2 text-sm font-bold ${priorityStyle[
              report.priority
            ]?.badge}`}
          >
            {report.priority}
          </span>

          <br />

          <span
            className={`rounded-full px-4 py-2 text-sm font-bold ${statusStyle[
              report.status
            ]}`}
          >
            {report.status}
          </span>

        </div>

      </div>

      {/* Body */}

      <div className="p-6">

        <div className="flex gap-5">

          <img
            src={`http://localhost:5000${report.photo}`}
            alt=""
            className="h-32 w-32 rounded-2xl border object-cover"
          />

          <div className="flex-1 space-y-2">

            <p>

              <strong>Pilgrim ID :</strong>{" "}

              {report.pilgrimId}

            </p>

            <p>

              <strong>Age :</strong>{" "}

              {report.age}

            </p>

            <p>

              <strong>Gender :</strong>{" "}

              {report.gender}

            </p>

            <p>

              <strong>Blood Group :</strong>{" "}

              {report.bloodGroup}

            </p>

          </div>

        </div>

        {/* Last Seen */}

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">

          <div className="flex items-center gap-2">

            <MapPin
              size={18}
              className="text-red-600"
            />

            <span className="font-semibold">

              Last Seen

            </span>

          </div>

          <p className="mt-3">

            {report.lastSeenLocation}

          </p>

          <div className="mt-3 flex items-center gap-2 text-slate-500">

            <Clock size={16} />

            {new Date(
              report.lastSeenTime
            ).toLocaleString()}

          </div>

        </div>

        {/* Volunteer */}

        <div className="mt-6 flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2">

              <User
                size={18}
                className="text-blue-600"
              />

              <span className="font-semibold">

                {report.volunteerName}

              </span>

            </div>

            <div className="mt-2 flex items-center gap-2 text-slate-500">

              <Phone size={16} />

              {report.volunteerMobile}

            </div>

          </div>

          <div className="text-right">

            <p className="text-sm text-slate-500">

              Reported

            </p>

            <p className="font-semibold">

              {getTimeAgo(
                report.createdAt
              )}

            </p>

          </div>

        </div>

        {/* Buttons */}

        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">

          <button
            onClick={() =>
              onView(report)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white transition hover:bg-blue-700"
          >
            <Eye size={18} />
            View
          </button>

          <button
            onClick={() =>
              onAssign(report)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3 text-white transition hover:bg-yellow-600"
          >
            <Shield size={18} />
            Assign
          </button>

          <button
            onClick={() =>
              onFound(report)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white transition hover:bg-green-700"
          >
            <CheckCircle2 size={18} />
            Found
          </button>

          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps?q=${report.latitude},${report.longitude}`,
                "_blank"
              )
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-white transition hover:bg-purple-700"
          >
            <Navigation size={18} />
            Navigate
          </button>

        </div>

      </div>

    </motion.div>
  );
}