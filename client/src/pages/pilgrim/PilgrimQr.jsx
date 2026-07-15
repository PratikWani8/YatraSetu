import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BadgeCheck,
  Download,
  Printer,
  Share2,
} from "lucide-react";

import Sidebar from "../../components/pilgrim/Sidebar";
import QRCard from "../../components/pilgrim/QRCard";
import { BASE_URL } from "../../api/api";

export default function PilgrimQr() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPilgrim();
  }, []);

  const fetchPilgrim = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/pilgrims/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.pilgrim);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <main className="flex-1 p-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-7xl"
        >

          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-500 p-8 text-white shadow-xl">

            <div className="flex items-center gap-4">

              <ShieldCheck size={55} />

              <div>

                <h1 className="text-4xl font-bold">
                  Digital Pilgrim Identity
                </h1>

                <p className="mt-2 text-blue-100">
                  Your official YatraSetu QR Identity Card
                </p>

              </div>

            </div>

          </div>

          {/* Content */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">

            {/* Left */}
            <div className="rounded-3xl bg-white p-8 shadow-xl">

              <div className="flex flex-col items-center">

                <img
                  src={`${BASE_URL}${user.photo}`}
                  alt={user.name}
                  className="h-44 w-44 rounded-full border-4 border-blue-500 object-cover"
                />

                <h2 className="mt-6 text-3xl font-bold">

                  {user.name}

                </h2>

                <p className="text-blue-600">

                  {user.pilgrimId}

                </p>

              </div>

              <div className="mt-8 space-y-5">

                <Detail
                  title="Blood Group"
                  value={user.bloodGroup}
                />

                <Detail
                  title="Mobile"
                  value={user.mobile}
                />

                <Detail
                  title="Emergency Contact"
                  value={user.emergencyNumber}
                />

                <Detail
                  title="Address"
                  value={user.address || "-"}
                />

              </div>

              <div className="mt-8 flex justify-center">

                <span className="flex items-center gap-2 rounded-full bg-green-100 px-6 py-3 font-semibold text-green-700">

                  <BadgeCheck size={18} />

                  Registered Pilgrim

                </span>

              </div>

            </div>

            {/* Right */}

            <div className="rounded-3xl bg-white p-8 shadow-xl">

              <QRCard pilgrim={user} />

            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-5">

            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">

              <Download size={20} />

              Download Card

            </button>

            <button className="flex items-center gap-2 rounded-xl bg-gray-800 px-7 py-3 font-semibold text-white hover:bg-black">

              <Printer size={20} />

              Print

            </button>

            <button className="flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3 font-semibold text-white hover:bg-green-700">

              <Share2 size={20} />

              Share

            </button>

          </div>

        </motion.div>

      </main>

    </div>
  );
}

function Detail({ title, value }) {
  return (
    <div className="flex justify-between rounded-xl bg-slate-50 p-4">
      <span className="font-medium text-gray-500">
        {title}
      </span>

      <span className="font-semibold text-gray-800">
        {value}
      </span>
    </div>
  );
}