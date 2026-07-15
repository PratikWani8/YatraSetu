import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/pilgrim/Sidebar";

import {
  Siren,
  Flame,
  Route,
  FileText,
  MessageCircle,
  ClipboardList,
} from "lucide-react";

export default function PilgrimEmergency() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "SOS",
      icon: Siren,
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      path: "/pilgrim/emergency/sos",
    },
    {
      title: "Heatmap",
      icon: Flame,
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      path: "/pilgrim/heatmap",
    },
    {
      title: "Route",
      icon: Route,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      path: "/pilgrim/emergency/route",
    },
    {
      title: "FIR",
      icon: FileText,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      path: "/pilgrim/fir",
    },
    {
      title: "Complaint",
      icon: MessageCircle,
      bg: "bg-violet-50",
      border: "border-violet-200",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      path: "/pilgrim/complaint",
    },
    {
      title: "Status",
      icon: ClipboardList,
      bg: "bg-sky-50",
      border: "border-sky-200",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      path: "/pilgrim/status",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        <div className="p-6 lg:p-8">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Emergency Services
            </h1>

            <p className="text-slate-500 mt-2">
              Access emergency services quickly during your pilgrimage.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

            {cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() => navigate(card.path)}
                  className={`
                    ${card.bg}
                    ${card.border}
                    border
                    rounded-3xl
                    h-44
                    cursor-pointer
                    flex
                    flex-col
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    shadow-sm
                    hover:shadow-xl
                  `}
                >
                  <div
                    className={`
                      ${card.iconBg}
                      w-16
                      h-16
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      mb-5
                    `}
                  >
                    <Icon
                      size={34}
                      className={card.iconColor}
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    {card.title}
                  </h2>
                </motion.div>
              );
            })}

          </div>

        </div>

      </main>

    </div>
  );
}