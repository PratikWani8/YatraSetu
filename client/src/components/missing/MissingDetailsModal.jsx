import { motion, AnimatePresence } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import {
  X,
  User,
  Phone,
  HeartPulse,
  MapPin,
  Clock,
  Calendar,
  ShieldAlert,
  FileText,
  BadgeInfo,
} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MissingDetailsModal({
  open,
  report,
  onClose,
}) {
  if (!open || !report) return null;

  const priorityColor = {
    Low: "bg-green-100 text-green-700",

    Medium: "bg-yellow-100 text-yellow-700",

    High: "bg-orange-100 text-orange-700",

    Critical:
      "bg-red-100 text-red-700 animate-pulse",
  };

  const statusColor = {
    Reported: "bg-blue-100 text-blue-700",

    Searching:
      "bg-yellow-100 text-yellow-700",

    "Police Assigned":
      "bg-purple-100 text-purple-700",

    Found: "bg-green-100 text-green-700",

    Closed: "bg-slate-100 text-slate-700",
  };

  return (
    <AnimatePresence>

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
      >

        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
          }}
          className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        >

          {/* Header */}

          <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">

            <div>

              <h2 className="text-3xl font-black">

                Missing Person Details

              </h2>

              <p className="mt-1 text-slate-500">

                {report.reportId}

              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 p-3 hover:bg-slate-200"
            >

              <X />

            </button>

          </div>

          {/* Body */}

          <div className="grid gap-8 p-8 lg:grid-cols-3">

            {/* LEFT */}

            <div>

              <img
                src={`http://localhost:5000${report.photo}`}
                alt=""
                className="h-80 w-full rounded-3xl border object-cover"
              />

              <div className="mt-6 flex gap-3">

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${priorityColor[
                    report.priority
                  ]}`}
                >

                  {report.priority}

                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${statusColor[
                    report.status
                  ]}`}
                >

                  {report.status}

                </span>

              </div>

            </div>

            {/* CENTER */}

            <div className="space-y-5">

              <h3 className="text-2xl font-bold">

                Pilgrim Information

              </h3>

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <User className="text-blue-600"/>

                  <div>

                    <p className="text-slate-500">

                      Name

                    </p>

                    <h4 className="font-bold">

                      {report.pilgrimName}

                    </h4>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <BadgeInfo className="text-blue-600"/>

                  <div>

                    <p className="text-slate-500">

                      Pilgrim ID

                    </p>

                    <h4 className="font-bold">

                      {report.pilgrimId}

                    </h4>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <Phone className="text-green-600"/>

                  <div>

                    <p className="text-slate-500">

                      Mobile

                    </p>

                    <h4 className="font-bold">

                      {report.mobile}

                    </h4>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <HeartPulse className="text-red-600"/>

                  <div>

                    <p className="text-slate-500">

                      Blood Group

                    </p>

                    <h4 className="font-bold">

                      {report.bloodGroup}

                    </h4>

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="space-y-5">

              <h3 className="text-2xl font-bold">

                Last Seen Information

              </h3>

              <div className="rounded-2xl bg-red-50 p-5">

                <div className="flex items-center gap-3">

                  <MapPin className="text-red-600"/>

                  <div>

                    <p className="text-slate-500">

                      Last Seen Location

                    </p>

                    <h4 className="font-bold">

                      {report.lastSeenLocation}

                    </h4>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <Calendar className="text-blue-600"/>

                  <div>

                    <p className="text-slate-500">

                      Last Seen Time

                    </p>

                    <h4 className="font-bold">

                      {new Date(
                        report.lastSeenTime
                      ).toLocaleString()}

                    </h4>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <Clock className="text-orange-600"/>

                  <div>

                    <p className="text-slate-500">

                      Report Created

                    </p>

                    <h4 className="font-bold">

                      {new Date(
                        report.createdAt
                      ).toLocaleString()}

                    </h4>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <ShieldAlert className="text-purple-600"/>

                  <div>

                    <p className="text-slate-500">

                      Reported By

                    </p>

                    <h4 className="font-bold">

                      {report.volunteerName}

                    </h4>

                    <p className="text-sm text-slate-500">

                      {report.volunteerMobile}

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Description */}

          <div className="px-8 pb-8">

            <div className="rounded-3xl bg-slate-50 p-6">

              <div className="mb-4 flex items-center gap-3">

                <FileText className="text-blue-600"/>

                <h3 className="text-xl font-bold">

                  Volunteer Notes

                </h3>

              </div>

              <p className="leading-8 text-slate-600">

                {report.description}

              </p>

            </div>

            {/* ================================
        Last Seen Map
================================ */}

<div className="px-8 pb-8">

  <div className="rounded-3xl overflow-hidden shadow border">

    <div className="border-b bg-slate-50 px-6 py-4">

      <h3 className="text-xl font-bold">

        Last Known Location

      </h3>

    </div>

    <MapContainer
      center={[
        Number(report.latitude),
        Number(report.longitude),
      ]}
      zoom={16}
      style={{
        height: "350px",
        width: "100%",
      }}
    >

      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[
          Number(report.latitude),
          Number(report.longitude),
        ]}
      >

        <Popup>

          <strong>

            {report.pilgrimName}

          </strong>

          <br />

          Last Seen Here

        </Popup>

      </Marker>

    </MapContainer>

  </div>

</div>

{/* ================================
        Footer Buttons
================================ */}

<div className="sticky bottom-0 flex flex-wrap justify-end gap-4 border-t bg-white p-6">

  <button
    onClick={() =>
      window.open(
        `https://www.google.com/maps?q=${report.latitude},${report.longitude}`,
        "_blank"
      )
    }
    className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
  >

    Navigate

  </button>

  <button
    onClick={() =>
      window.print()
    }
    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
  >

    Print

  </button>

  <button
    className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-white hover:bg-yellow-600"
  >

    Assign Police

  </button>

  <button
    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
  >

    Mark Found

  </button>

  <button
    onClick={onClose}
    className="rounded-xl bg-slate-200 px-6 py-3 font-semibold hover:bg-slate-300"
  >

    Close

  </button>

</div>
</div>

        </motion.div>

      </motion.div>
      

    </AnimatePresence>

  );
}