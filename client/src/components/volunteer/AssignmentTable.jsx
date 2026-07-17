import React from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const AssignmentTable = ({ assignments = [] }) => {
  const priorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";

      case "High":
        return "bg-orange-100 text-orange-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Accepted":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="overflow-hidden rounded-2xl bg-white shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-indigo-600" />

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Recent Assignments
            </h2>

            <p className="text-sm text-slate-500">
              Latest assigned volunteer tasks
            </p>
          </div>
        </div>

        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
          View All
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                ID
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Task
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Priority
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="border-b transition hover:bg-slate-50"
                >
                  <td className="px-6 py-5 font-semibold text-slate-700">
                    {assignment.id}
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {assignment.task}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor(
                        assignment.priority
                      )}`}
                    >
                      {assignment.priority}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                        assignment.status
                      )}`}
                    >
                      {assignment.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-3">
                      <button className="rounded-lg bg-slate-100 p-2 transition hover:bg-slate-200">
                        <Eye size={18} />
                      </button>

                      <button className="rounded-lg bg-green-100 p-2 text-green-700 transition hover:bg-green-200">
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-slate-500">
                  No Assignments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 p-4 md:hidden">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                  {assignment.task}
                </h3>

                <span className="text-sm font-medium text-slate-500">
                  {assignment.id}
                </span>
              </div>

              <div className="mb-3 flex gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor(
                    assignment.priority
                  )}`}
                >
                  {assignment.priority}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                    assignment.status
                  )}`}
                >
                  {assignment.status}
                </span>
              </div>

              <div className="flex gap-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-white transition hover:bg-indigo-700">
                  <Eye size={18} />
                  View
                </button>

                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-white transition hover:bg-green-700">
                  <CheckCircle size={18} />
                  Complete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-slate-50 py-10 text-center">
            <Clock
              className="mx-auto mb-3 text-slate-400"
              size={40}
            />

            <p className="text-slate-500">
              No Assignments Available
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <AlertTriangle size={16} />
          Keep your assignments updated regularly.
        </div>

        <button className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-slate-100">
          Refresh
        </button>
      </div>
    </motion.div>
  );
};

export default AssignmentTable;