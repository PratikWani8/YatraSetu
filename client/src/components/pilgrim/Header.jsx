import { motion } from "framer-motion";
import {
  Bell,
  Settings,
  CalendarDays,
} from "lucide-react";

export default function Header({ user }) {
  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-lg lg:flex-row lg:items-center lg:justify-between"
    >
      {/* Left */}

      <div>

        <h1 className="text-4xl font-black text-gray-800">

          👋 Welcome Back,

        </h1>

        <h2 className="mt-2 text-3xl font-bold text-blue-700">

          {user?.name}

        </h2>

        <p className="mt-2 text-gray-500">

          Stay safe throughout your pilgrimage.

        </p>

        <div className="mt-4 flex items-center gap-2 text-gray-500">

          <CalendarDays size={18} />

          {today}

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Notification */}

        <button className="relative rounded-2xl bg-blue-50 p-4 transition hover:bg-blue-100">

          <Bell
            size={24}
            className="text-blue-700"
          />

          <span className="absolute right-3 top-3 h-3 w-3 rounded-full bg-red-500"></span>

        </button>

        {/* Settings */}

        <button className="rounded-2xl bg-blue-50 p-4 transition hover:bg-blue-100">

          <Settings
            size={24}
            className="text-blue-700"
          />

        </button>

        {/* Profile */}

        <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-3 shadow-lg">

          <img
            src={
              user?.photo
                ? `http://localhost:5000${user.photo}`
                : "https://ui-avatars.com/api/?name=Pilgrim"
            }
            alt="Profile"
            className="h-16 w-16 rounded-full border-4 border-white object-cover"
          />

          <div className="hidden lg:block">

            <h3 className="font-bold text-white">

              {user?.name}

            </h3>

            <p className="text-sm text-blue-100">

              {user?.pilgrimId}

            </p>

            <div className="mt-1 flex items-center gap-2">

              <div className="h-2 w-2 rounded-full bg-green-400"></div>

              <span className="text-xs text-white">

                Online

              </span>

            </div>

          </div>

        </div>

      </div>
    </motion.header>
  );
}