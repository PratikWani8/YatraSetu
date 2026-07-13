import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Users,
  Building2,
  Hospital,
  Radio,
  CloudSun,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const roles = [
  {
    title: "Login as Pilgrim",
    description:
      "Access your QR ID, emergency services, travel information and profile.",
    icon: User,
    path: "/pilgrim/login",
  },
  {
    title: "Login as Volunteer",
    description:
      "Manage rescue operations, scan QR codes and assist pilgrims.",
    icon: Users,
    path: "/volunteer/login",
  },
  {
  title: "Login as NGO",
  description:
    "Sign in to your NGO account to manage relief operations, volunteers, and emergency support requests.",
  icon: Building2,
  path: "/ngo/login",
},
  {
    title: "Login as Hospital",
    description:
      "View emergency requests, patient information and ambulance updates.",
    icon: Hospital,
    path: "/hospital/login",
  },
  {
    title: "Login as Control Room",
    description:
      "Monitor live incidents, SOS alerts and coordinate emergency teams.",
    icon: Radio,
    path: "/control-room/login",
  },
  {
    title: "Login as Weather Officer",
    description:
      "Manage weather forecasts and issue alerts for pilgrims.",
    icon: CloudSun,
    path: "/weather/login",
  },
];

export default function LoginRolePortal() {
  return (
    <div className="min-h-screen bg-[#FFF7ED] pt-16 px-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2">
            <ShieldCheck className="h-5 w-5 text-[#F97316]" />
            <span className="font-semibold text-[#F97316]">
              YatraSetu Secure Login
            </span>
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-[#F97316]">
            Welcome Back
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Select your role to securely access the YatraSetu platform and
            continue supporting a safe pilgrimage.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = role.icon;

            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.12,
                  duration: 0.45,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
              >
                <Link to={role.path}>
                  <div className="group h-full rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-2xl">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 transition-all duration-300 group-hover:bg-[#F97316]">
                      <Icon className="h-8 w-8 text-[#F97316] transition-all duration-300 group-hover:text-white" />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-gray-800">
                      {role.title}
                    </h2>

                    <p className="mt-3 text-gray-600 leading-relaxed">
                      {role.description}
                    </p>

                    <div className="mt-8 flex items-center justify-between">
                      <span className="font-semibold text-[#F97316]">
                        Secure Login
                      </span>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 transition-all duration-300 group-hover:bg-[#F97316]">
                        <ArrowRight className="h-5 w-5 text-[#F97316] group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}

<div className="mt-20 -mx-6">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="w-full bg-gradient-to-r from-[#F97316] to-orange-500 py-16"
  >
    <div className="mx-auto max-w-7xl px-6 text-center">
      <h2 className="text-3xl font-bold text-white md:text-4xl">
        New to YatraSetu?
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-orange-100">
        Create your account to access AI-powered pilgrimage safety services,
        emergency assistance, live weather alerts, and much more.
      </p>

      <Link
        to="/register-role-portal"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-[#F97316] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        Register Now
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  </motion.div>
</div>
      </div>
    </div>
  );
}