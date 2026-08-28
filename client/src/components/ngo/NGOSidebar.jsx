import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  UtensilsCrossed,
  Droplets,
  HeartPulse,
  MapPinned,
  Package,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/ngo/dashboard",
  },
  {
    title: "Organization Profile",
    icon: Building2,
    path: "/ngo/profile",
  },
  {
    title: "Volunteer Management",
    icon: Users,
    path: "/ngo/dashboard/volunteer-list",
  },
  {
    title: "Food Distribution",
    icon: UtensilsCrossed,
    path: "/ngo/dashboard/food-distribution",
  },
  {
    title: "Water Distribution",
    icon: Droplets,
    path: "/ngo/dashboard/water-distribution",
  },
  {
    title: "Medical Camps",
    icon: HeartPulse,
    path: "/ngo/medical-camps",
  },
  {
    title: "Distribution Locations",
    icon: MapPinned,
    path: "/ngo/locations",
  },
  {
    title: "Inventory",
    icon: Package,
    path: "/ngo/inventory",
  },
  {
    title: "Announcements",
    icon: Megaphone,
    path: "/ngo/announcements",
  },
  {
    title: "Reports",
    icon: BarChart3,
    path: "/ngo/dashboard/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/ngo/settings",
  },
];

export default function NGOSidebar() {
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <motion.aside
      animate={{
        width: collapsed ? 90 : 280,
      }}
      transition={{
        duration: 0.25,
      }}
      className="sticky top-0 flex h-screen flex-shrink-0 flex-col bg-gradient-to-b from-violet-700 via-purple-800 to-indigo-900 text-white shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-5">

        <div className="flex items-center gap-3 overflow-hidden">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">

            <Building2 size={28} />

          </div>

          {!collapsed && (
            <div>

              <h2 className="text-xl font-black">
                NGO Portal
              </h2>

              <p className="text-xs text-violet-200">
                YatraSetu
              </p>

            </div>
          )}

        </div>

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="rounded-lg bg-white/10 p-2 transition hover:bg-white/20"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

      </div>

      {/* Organization */}
      {!collapsed && (
        <div className="border-b border-white/10 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500">

              <Building2 size={28} />

            </div>

            <div>

              <h3 className="font-bold">
                Helping Hands Foundation
              </h3>

              <p className="text-xs text-violet-200">
                Registered NGO
              </p>

            </div>

          </div>

        </div>
      )}

      {/* Navigation */}

      <nav className="flex-1 space-y-2 overflow-y-auto p-4 hide-scrollbar">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
  key={item.title}
  to={item.path}
  end={item.path === "/ngo/dashboard"}
  className={({ isActive }) =>
    `flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
      isActive
        ? "bg-white/20 shadow-lg"
        : "hover:bg-white/10"
    }`
  }
>
              <Icon size={22} />

              {!collapsed && (
                <span className="font-medium">
                  {item.title}
                </span>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* Logout */}

      <div className="border-t border-white/10 p-4">

        <button className="flex w-full items-center gap-4 rounded-xl bg-red-500/20 px-4 py-3 transition hover:bg-red-500/30">

          <LogOut size={22} />

          {!collapsed && (
            <span className="font-semibold">
              Logout
            </span>
          )}

        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} YatraSetu 
          </p>

      </div>

    </motion.aside>
  );
}