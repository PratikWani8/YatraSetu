import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const QuickActionCard = ({
  title,
  description,
  icon,
  color = "bg-blue-100",
  link = "#",
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.25,
      }}
      onClick={() => navigate(link)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-xl"    
      >
        
      {/* Icon */}
      <div
        className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${color} transition-transform duration-300 group-hover:scale-110`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-blue-600">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      {/* Bottom */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-medium text-blue-600">
          Open
        </span>

        <div className="rounded-full bg-slate-100 p-2 transition-all group-hover:bg-blue-600 group-hover:text-white">
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>

      {/* Decorative Background Circle */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100 opacity-20 transition-all duration-300 group-hover:scale-125" />
    </motion.div>
  );
};

export default QuickActionCard;