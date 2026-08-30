import { motion } from "framer-motion";
import {
  LayoutDashboard,
  QrCode,
  Users,
  TriangleAlert,
  Stethoscope,
  Pill,
  Ambulance,
  BedDouble,
  FileText,
  User,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function HospitalSidebar() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/hospital/dashboard",
    },
    {
      title: "Scan QR",
      icon: QrCode,
      path: "/hospital/scan-qr",
    },
    {
      title: "Patients",
      icon: Users,
      path: "/hospital/patients",
    },
    {
      title: "Emergency Cases",
      icon: TriangleAlert,
      path: "/hospital/emergency",
    },
    {
      title: "Diagnosis",
      icon: Stethoscope,
      path: "/hospital/diagnosis",
    },
    {
      title: "Prescriptions",
      icon: Pill,
      path: "/hospital/prescriptions",
    },
    {
      title: "Ambulance",
      icon: Ambulance,
      path: "/hospital/ambulance",
    },
    {
      title: "Bed Management",
      icon: BedDouble,
      path: "/hospital/beds",
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/hospital/reports",
    },
    {
      title: "Profile",
      icon: User,
      path: "/hospital/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/hospital/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/hospital/login");
  };

  return (
    <>
      {/* Mobile Toggle */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-red-600 p-3 text-white shadow-xl lg:hidden"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}

      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{
          x: isOpen || window.innerWidth >= 1024 ? 0 : -320,
          opacity: 1,
        }}
        transition={{ duration: 0.35 }}
        className="hide-scrollbar fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-y-auto border-r border-red-100 bg-white shadow-2xl lg:sticky"
      >
        {/* Logo */}

        <div className="border-b border-red-100 p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg">

              <Building2 size={30} />

            </div>

            <div>

              <h2 className="text-2xl font-black text-gray-900">
                Hospital
              </h2>

              <p className="text-sm text-gray-500">
                Management Panel
              </p>

            </div>

          </div>

        </div>

        {/* Hospital Info */}

        <div className="border-b border-red-100 p-6">

          <div className="flex items-center gap-4">

            <img
              src="https://ui-avatars.com/api/?name=Hospital&background=dc2626&color=fff"
              alt="Hospital"
              className="h-14 w-14 rounded-full border-4 border-red-100"
            />

            <div>

              <h3 className="font-bold text-gray-900">
                City Hospital
              </h3>

              <p className="text-sm text-gray-500">
                Hospital Administrator
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.slice(0, 6).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`
                }
              >
                <Icon size={21} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}

                    {/* Remaining Navigation */}

          {menuItems.slice(6).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`
                }
              >
                <Icon size={21} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}

        <div className="border-t border-red-100 p-4">

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
          >
            <LogOut size={20} />
            Logout
          </motion.button>

          <p className="mt-4 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} YatraSetu 
          </p>

        </div>

      </motion.aside>

      {/* Mobile Overlay */}

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}