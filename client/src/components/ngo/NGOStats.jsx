import { motion } from "framer-motion";
import {
  Users,
  UtensilsCrossed,
  Droplets,
  HeartPulse,
  MapPinned,
  Package,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Volunteers",
    value: "248",
    change: "+12%",
    icon: Users,
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Food Packets",
    value: "14,320",
    change: "+18%",
    icon: UtensilsCrossed,
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Water Bottles",
    value: "9,870",
    change: "+9%",
    icon: Droplets,
    color: "from-sky-500 to-cyan-500",
  },
  {
    title: "Medical Camps",
    value: "36",
    change: "+5%",
    icon: HeartPulse,
    color: "from-red-500 to-pink-500",
  },
  {
    title: "Distribution Centers",
    value: "18",
    change: "+2",
    icon: MapPinned,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Inventory Stock",
    value: "92%",
    change: "Healthy",
    icon: Package,
    color: "from-indigo-500 to-violet-600",
  },
];

export default function NGOStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className="overflow-hidden rounded-3xl bg-white shadow-lg transition"
          >
            <div
              className={`bg-gradient-to-r ${item.color} p-5 text-white`}
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm opacity-90">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-4xl font-black">
                    {item.value}
                  </h2>

                </div>

                <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">

                  <Icon size={34} />

                </div>

              </div>
            </div>

            <div className="flex items-center justify-between p-5">

              <div className="flex items-center gap-2 text-green-600">

                <TrendingUp size={18} />

                <span className="font-semibold">
                  {item.change}
                </span>

              </div>

              <span className="text-sm text-gray-500">
                Since last week
              </span>

            </div>

          </motion.div>
        );
      })}
    </div>
  );
}