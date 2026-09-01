import { Search, RotateCcw } from "lucide-react";

export default function MissingFilters({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  sort,
  setSort,
}) {
  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setSort("newest");
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">

      <div className="grid gap-4 lg:grid-cols-5">

        {/* Search */}

        <div className="relative lg:col-span-2">

          <Search
            className="absolute left-4 top-4 text-slate-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search Report ID / Pilgrim ID / Name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 py-4 pl-12 pr-4 outline-none transition focus:border-blue-500"
          />

        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-500"
        >

          <option value="">

            All Status

          </option>

          <option value="Reported">

            Reported

          </option>

          <option value="Searching">

            Searching

          </option>

          <option value="Police Assigned">

            Police Assigned

          </option>

          <option value="Found">

            Found

          </option>

          <option value="Closed">

            Closed

          </option>

        </select>

        {/* Priority */}

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          className="rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-500"
        >

          <option value="">

            All Priority

          </option>

          <option value="Low">

            Low

          </option>

          <option value="Medium">

            Medium

          </option>

          <option value="High">

            High

          </option>

          <option value="Critical">

            Critical

          </option>

        </select>

        {/* Sort */}

        <div className="flex gap-3">

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="flex-1 rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-500"
          >

            <option value="newest">

              Newest

            </option>

            <option value="oldest">

              Oldest

            </option>

            <option value="priority">

              Priority

            </option>

            <option value="name">

              Name

            </option>

          </select>

          <button
            onClick={resetFilters}
            className="rounded-xl bg-slate-100 px-4 transition hover:bg-slate-200"
          >

            <RotateCcw size={20} />

          </button>

        </div>

      </div>

    </div>
  );
}