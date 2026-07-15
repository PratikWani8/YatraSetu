import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/pilgrim/Sidebar";
import Header from "../../components/pilgrim/Header";
import ProfileCard from "../../components/pilgrim/ProfileCard";
import WeatherCard from "../../components/pilgrim/WeatherCard";
import { motion } from "framer-motion";
import { BASE_URL } from "../../api/api";

export default function PilgrimDashboard() {

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
    console.error(err);
  }
};

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        <div className="p-6 lg:p-8 space-y-8">

          {/* Header */}
          <Header user={user} />

          {/* Body */}
          <div className="grid gap-8 xl:grid-cols-12">

            {/* Left */}
            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="xl:col-span-4"
            >
              <ProfileCard user={user} />
            </motion.div>

            {/* Right */}
            <motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  className="space-y-8 xl:col-span-12"
>
  <WeatherCard />
</motion.div>

          </div>

        </div>

      </main>

    </div>
  );
}