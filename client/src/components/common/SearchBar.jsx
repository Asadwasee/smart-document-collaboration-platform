import { useState } from "react";
import {
  Search,
  FileText,
  Folder,
  User,
  X,
} from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isFocused, setIsFocused] = useState(false);

  const searchData = [
    {
      id: 1,
      type: "document",
      title: "Project Requirements",
      subtitle: "My Projects",
    },
    {
      id: 2,
      type: "document",
      title: "Smart Document Plan",
      subtitle: "University",
    },
    {
      id: 3,
      type: "folder",
      title: "Projects",
      subtitle: "My Projects",
    },
    {
      id: 4,
      type: "folder",
      title: "Documents",
      subtitle: "University",
    },
    {
      id: 5,
      type: "user",
      title: "Ali",
      subtitle: "ali@example.com",
    },
    {
      id: 6,
      type: "user",
      title: "Sara",
      subtitle: "sara@example.com",
    },
  ];

  const filteredResults = searchData.filter((item) => {
    const searchTerm = query.toLowerCase();

    const matchesQuery =
      item.title.toLowerCase().includes(searchTerm) ||
      item.subtitle.toLowerCase().includes(searchTerm);

    const matchesFilter =
      filter === "all" || item.type === filter;

    return matchesQuery && matchesFilter;
  });

  const getIcon = (type) => {
    if (type === "document") {
      return <FileText size={18} className="text-indigo-600" />;
    }

    if (type === "folder") {
      return <Folder size={18} className="text-teal-600" />;
    }

    return <User size={18} className="text-slate-500" />;
  };

  const showResults =
    isFocused && query.trim().length > 0;

  return (
    <div className="relative w-full min-w-0 max-w-2xl">
      {/* Search Input */}
      <div
        className={`flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-2.5 transition ${
          isFocused
            ? "border-indigo-500 ring-4 ring-indigo-50"
            : "border-slate-200"
        }`}
      >
        <Search
          size={19}
          className="shrink-0 text-slate-400"
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search documents, folders, people..."
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto border-b border-slate-100 p-3">
            {[
              ["all", "All"],
              ["document", "Documents"],
              ["folder", "Folders"],
              ["user", "People"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filter === value
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                  onClick={() =>
                    console.log("Selected search result:", item)
                  }
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                    {getIcon(item.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {item.title}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-10 text-center">
                <Search
                  size={28}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No results found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try another search term or filter.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;