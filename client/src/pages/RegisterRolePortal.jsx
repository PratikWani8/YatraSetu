import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Users,
  Building2,
  Radio,
  CloudSun,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const roles = [
  {
    title: "Register as Pilgrim",
    description:
      "Create your pilgrim profile, generate your QR ID and access safety services.",
    icon: User,
    path: "/pilgrim/register",
  },
  {
    title: "Register as Volunteer",
    description:
      "Join the volunteer network and assist pilgrims during emergencies.",
    icon: Users,
    path: "/volunteer/register",
  },
  {
    title: "Register as Hospital",
    description:
      "Connect your hospital with YatraSetu for emergency medical support.",
    icon: Building2,
    path: "/hospital/register",
  },
  {
    title: "Register as Control Room",
    description:
      "Manage incidents, coordinate rescue teams and monitor pilgrims.",
    icon: Radio,
    path: "/control-room/register",
  },
  {
    title: "Register as Weather Officer",
    description:
      "Provide weather alerts and environmental updates in real time.",
    icon: CloudSun,
    path: "/weather/register",
  },
];

export default function RegisterRolePortal() {
  return (
    <div className="min-h-screen bg-[#FFF7ED] pt-16 px-6">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2">
            <ShieldCheck className="h-5 w-5 text-[#F97316]" />
            <span className="font-semibold text-[#F97316]">
              YatraSetu Registration Portal
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold text-[#F97316] md:text-5xl">
            Choose Your Role
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Register with YatraSetu according to your responsibility and become
            part of a safer pilgrimage ecosystem.
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

                    {/* Icon */}

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 transition duration-300 group-hover:bg-[#F97316]">
                      <Icon className="h-8 w-8 text-[#F97316] transition duration-300 group-hover:text-white" />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-gray-800">
                      {role.title}
                    </h2>

                    <p className="mt-3 leading-relaxed text-gray-600">
                      {role.description}
                    </p>

                    <button className="mt-8 rounded-xl bg-[#F97316] px-6 py-3 font-semibold text-white transition duration-300 hover:bg-orange-600">
                      Register →
                    </button>
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
        Alredy Registered?
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-orange-100">
        Login your account to access AI-powered pilgrimage safety services,
        emergency assistance, live weather alerts, and much more.
      </p>

      <Link
        to="/login-role-portal"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-[#F97316] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        Login Now
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  </motion.div>
</div>
      </div>
    </div>
  );
}