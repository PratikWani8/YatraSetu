import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../../services/authApi";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  Siren,
  QrCode,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/pilgrim/dashboard",
    },
    {
      title: "Personal Info",
      icon: User,
      path: "/pilgrim/info",
    },
    {
      title: "Emergency",
      icon: Siren,
      path: "/pilgrim/emergency",
    },
    {
      title: "QR Code",
      icon: QrCode,
      path: "/pilgrim/qr",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/pilgrim/settings",
    },
  ];

   const handleLogout = async () => {
  try {
    await API.post("/logout");

    toast.success("Logged out successfully");
  } catch (err) {
    console.log(err);
  } finally {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    navigate("/", { replace: true });
  }
};

  return (
    <>
      {/* Mobile Button */}

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-blue-600 p-3 text-white shadow-xl lg:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-gradient-to-b from-blue-700 via-blue-600 to-cyan-600 text-white shadow-2xl lg:hidden"
            >
              <SidebarContent
                menuItems={menuItems}
                collapsed={false}
                close={() => setMobileOpen(false)}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}

      <motion.aside
        animate={{
          width: collapsed ? 90 : 280,
        }}
        className="sticky top-0 hidden h-screen flex-shrink-0 border-r border-blue-200 bg-gradient-to-b from-blue-700 via-blue-600 to-cyan-600 text-white shadow-xl lg:flex lg:flex-col"
      >
        <SidebarContent
          menuItems={menuItems}
          collapsed={collapsed}
          onLogout={handleLogout}
        />

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="absolute bottom-8 right-[-18px] flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-700 shadow-xl"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </motion.aside>
    </>
  );
}

function SidebarContent({
  menuItems,
  collapsed,
  close,
  onLogout,
}) {
  return (
    <>
      {/* Logo */}

      <div className="flex items-center justify-between border-b border-white/20 p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-700">

            🛕

          </div>

          {!collapsed && (
            <div>

              <h2 className="text-xl font-bold">
                YatraSetu
              </h2>

              <p className="text-xs text-blue-100">
                Health, Safety & Emergency
              </p>

            </div>
          )}

        </div>

        {close && (
          <button onClick={close}>
            <X />
          </button>
        )}

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300

                ${
                  isActive
                    ? "bg-white text-blue-700 shadow-lg"
                    : "text-white hover:bg-white/20"
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

      <div className="border-t border-white/20 p-4">

        <button 
        onClick={onLogout}
        className="flex w-full items-center gap-4 rounded-xl bg-red-500 px-4 py-3 transition hover:bg-red-600">

          <LogOut size={22} />

          {!collapsed && (
            <span className="font-semibold">
              Logout
            </span>
          )}

        </button>

      </div>
    </>
  );
}