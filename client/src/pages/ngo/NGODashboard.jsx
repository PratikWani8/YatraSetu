import { Bell, Search, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import NGOSidebar from "../../components/ngo/NGOSidebar";
import NGOStats from "../../components/ngo/NGOStats";

export default function NGODashboard() {
  const ngo =
    JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <NGOSidebar />

      {/* Main Content */}

      <div className="flex flex-1 flex-col">

        {/* Header */}

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b bg-white px-8 shadow-sm">

          {/* Search */}

          <div className="relative hidden w-full max-w-md lg:block">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border bg-gray-50 py-3 pl-12 pr-4 outline-none transition focus:border-violet-500"
            />

          </div>

          {/* Right */}

          <div className="ml-auto flex items-center gap-6">

            <button className="relative rounded-xl bg-gray-100 p-3 transition hover:bg-violet-100">

              <Bell
                size={22}
                className="text-violet-700"
              />

              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />

            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">

                <Building2
                  size={26}
                  className="text-violet-700"
                />

              </div>

              <div>

                <h3 className="font-bold">
                  {ngo.organizationName ||
                    "NGO Organization"}
                </h3>

                <p className="text-sm text-gray-500">
                  NGO Administrator
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* Content */}

        <main className="flex-1 p-8">

          {/* Welcome */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-8 text-white shadow-xl"
          >

            <h1 className="text-4xl font-black">
              Welcome Back 👋
            </h1>

            <p className="mt-3 text-violet-100 text-lg">

              {ngo.organizationName ||
                "Helping Hands Foundation"}

            </p>

            <p className="mt-2 max-w-3xl text-violet-200">

              Manage volunteers, food distribution,
              medical camps, inventory, reports,
              and relief activities from one place.

            </p>

          </motion.div>

          {/* Statistics */}

          <section className="mt-8">

            <h2 className="mb-5 text-2xl font-bold">
              Overview
            </h2>

            <NGOStats />

          </section>

        </main>

      </div>

    </div>
  );
}