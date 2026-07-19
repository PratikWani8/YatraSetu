import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/volunteerApi";
import {
  LayoutDashboard,
  UserPlus,
  QrCode,
  Search,
  Ambulance,
  Hospital,
  ShieldAlert,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BASE_URL } from "../../api/api";


const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/volunteer/dashboard",
  },
  {
    title: "Assignments",
    icon: <ClipboardList size={20} />,
    path: "/volunteer/dashboard/assignment",
  },
  {
    title: "Register Pilgrim",
    icon: <UserPlus size={20} />,
    path: "/volunteer/pilgrim-info-reg",
  },
  {
    title: "Scan QR",
    icon: <QrCode size={20} />,
    path: "/volunteer/scan-qr",
  },
  {
    title: "Medical Emergency",
    icon: <Ambulance size={20} />,
    path: "/volunteer/medical-emergency",
  },
  {
    title: "Missing Person",
    icon: <Search size={20} />,
    path: "/volunteer/dashboard/missing-person",
  },
  {
    title: "Nearby Hospitals",
    icon: <Hospital size={20} />,
    path: "/volunteer/dashboard/hospitals",
  },
  {
  title: "Nearby Police Stations",
  icon: <ShieldAlert size={20} />,
  path: "/volunteer/dashboard/police-stations",
  },
  {
    title: "Profile",
    icon: <User size={20} />,
    path: "/volunteer/dashboard/profile",
  },
];

const VolunteerSidebar = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [volunteer, setVolunteer] = useState({
  fullName: "",
  profilePhoto: "",
});

const fetchVolunteer = async () => {
  try {
    const { data } = await API.get("/volunteer/profile");

    if (data.success) {
      const user = data.volunteer;

      setVolunteer({
        fullName: user.fullName,
        profilePhoto: user.profilePhoto
          ? `${BASE_URL}/uploads/volunteers/${user.profilePhoto}`
          : "https://i.pravatar.cc/100",
      });
    }
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchVolunteer();
}, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  setMobileOpen(false);

  navigate("/", { replace: true });
};

  return (
  <>
    {/* Mobile Header */}
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white shadow px-4 py-3">
      <h2 className="text-xl font-bold text-blue-700">
        YatraSetu
      </h2>

      <button onClick={() => setMobileOpen(true)}>
        <Menu size={28} />
      </button>
    </div>

    {/* Mobile Overlay */}
    {mobileOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={() => setMobileOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside
      className={`
        fixed lg:sticky
        top-0 left-0
        h-screen
        z-50
        bg-white
        border-r
        shadow-xl
        transition-all
        duration-300
        flex flex-col
        overflow-hidden

        ${collapsed ? "w-24" : "w-72"}
        ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-5 shrink-0">
        {!collapsed && (
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              YatraSetu
            </h1>

            <p className="text-sm text-gray-500">
              Volunteer Portal
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {/* Collapse Desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>

          {/* Close Mobile */}
          <button
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Volunteer Profile */}
      <div className="border-b px-5 py-6 shrink-0">
        <div className="flex items-center gap-4">
          <img
  src={volunteer.profilePhoto}
  alt={volunteer.fullName}
  className="h-14 w-14 rounded-full object-cover"
/>

          {!collapsed && (
            <div>
              <h3 className="font-semibold">
  {volunteer.fullName || "Volunteer"}
</h3>

              <p className="text-sm text-gray-500">
                Volunteer
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <li key={item.title}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex
                    items-center
                    gap-4
                    rounded-xl
                    px-4
                    py-3
                    transition-all

                    ${
                      active
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                    }
                  `}
                >
                  {item.icon}

                  {!collapsed && (
                    <span className="font-medium">
                      {item.title}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout */}
      <div className="border-t p-4 shrink-0">
        <button 
         onClick={handleLogout}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-100">
          <LogOut size={20} />

          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>

    {/* Mobile Spacer */}
    <div className="h-16 lg:hidden"></div>
  </>
);
};

export default VolunteerSidebar;