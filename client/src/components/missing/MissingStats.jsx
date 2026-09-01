import {
  Users,
  Search,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function MissingStats({ stats }) {
  const cards = [
    {
      title: "Total Reports",
      value: stats.total || 0,
      icon: Users,
      color: "blue",
    },
    {
      title: "Searching",
      value: stats.searching || 0,
      icon: Search,
      color: "amber",
    },
    {
      title: "Critical",
      value: stats.critical || 0,
      icon: AlertTriangle,
      color: "red",
      pulse: true,
    },
    {
      title: "Found",
      value: stats.found || 0,
      icon: CheckCircle2,
      color: "green",
    },
  ];

  const colors = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      text: "text-blue-700",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      text: "text-amber-700",
    },
    red: {
      bg: "bg-red-50",
      icon: "bg-red-100 text-red-600",
      text: "text-red-700",
    },
    green: {
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
      text: "text-green-700",
    },
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.1,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className={`rounded-3xl p-6 shadow-lg border ${colors[card.color].bg} ${
              card.pulse
                ? "animate-pulse border-red-300"
                : "border-transparent"
            }`}
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">

                  {card.title}

                </p>

                <h2
                  className={`mt-3 text-4xl font-black ${colors[card.color].text}`}
                >
                  {card.value}
                </h2>

              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colors[card.color].icon}`}
              >
                <Icon size={30} />
              </div>

            </div>

          </motion.div>
        );
      })}

    </div>
  );
}