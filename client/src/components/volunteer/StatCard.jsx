import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowUpRight } from "lucide-react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl"
    >
      {/* Top Accent */}
      <div className={`absolute top-0 left-0 h-1 w-full ${color}`} />

      <div className="flex items-start justify-between">
        {/* Left */}
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-800">
            <CountUp
              start={0}
              end={Number(value) || 0}
              duration={2}
              separator=","
              useEasing
              preserveValue={false}
            />
          </h2>

          <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
            <ArrowUpRight size={16} />
            <span>Updated today</span>
          </div>
        </div>

        {/* Right Icon */}
        <motion.div
          whileHover={{
            rotate: 10,
            scale: 1.1,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
          }}
          className={`${color} flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg`}
        >
          {icon}
        </motion.div>
      </div>

      {/* Decorative Background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
        }}
        className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-slate-100"
      />
    </motion.div>
  );
};

export default StatCard;