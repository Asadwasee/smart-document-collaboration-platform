import { useEffect, useRef, useState } from "react";
import {
  Search,
  FileText,
  Folder,
  User,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const SearchBar = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");

  /*
   * Close search results when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * Search backend
   */
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const searchTimer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/search", {
          params: {
            q: trimmedQuery,
            type: filter,
            page: 1,
            limit: 10,
          },
        });

        if (cancelled) return;

        console.log("Search response:", response.data);

        const searchData = response.data?.data || {};
        const formattedResults = [];

        /*
         * Documents
         */
        if (searchData.documents?.data) {
          searchData.documents.data.forEach((document) => {
            formattedResults.push({
              id: document._id,
              type: "document",
              title: document.title,
              subtitle:
                document.workspace?.name || "Document",
              workspaceId:
                document.workspace?._id ||
                document.workspace,
            });
          });
        }

        /*
         * Folders
         */
        if (searchData.folders?.data) {
          searchData.folders.data.forEach((folder) => {
            formattedResults.push({
              id: folder._id,
              type: "folder",
              title: folder.name,
              subtitle:
                folder.workspace?.name || "Folder",
              workspaceId:
                folder.workspace?._id ||
                folder.workspace,
            });
          });
        }

        /*
         * Users
         */
        if (searchData.users?.data) {
          searchData.users.data.forEach((user) => {
            formattedResults.push({
              id: user._id,
              type: "user",
              title: user.name,
              subtitle: user.email,
            });
          });
        }

        setResults(formattedResults);
      } catch (searchError) {
        if (cancelled) return;

        console.error("Search failed:", searchError);
        console.error(
          "Backend response:",
          searchError.response?.data
        );

        setResults([]);

        setError(
          searchError.response?.data?.message ||
            "Failed to search. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(searchTimer);
    };
  }, [query, filter]);

  const getIcon = (type) => {
    if (type === "document") {
      return (
        <FileText
          size={18}
          className="text-indigo-600"
        />
      );
    }

    if (type === "folder") {
      return (
        <Folder
          size={18}
          className="text-teal-600"
        />
      );
    }

    return (
      <User
        size={18}
        className="text-slate-500"
      />
    );
  };

  const handleResultClick = (item) => {
    if (item.type === "document") {
      navigate(`/editor?id=${item.id}`);
    }

    if (item.type === "folder") {
      /*
       * This assumes your workspace page supports
       * a workspace ID in the URL.
       */
      navigate(`/workspace/${item.workspaceId}`);
    }

    if (item.type === "user") {
      /*
       * Users are currently searched mainly for
       * sharing/permissions.
       */
      console.log("Selected user:", item);
    }

    setIsFocused(false);
    setQuery("");
  };

  const showResults =
    isFocused && query.trim().length > 0;

  return (
    <div
      ref={searchRef}
      className="relative w-full min-w-0 max-w-2xl"
    >
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
          onChange={(event) => {
            setQuery(event.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder="Search documents, folders, people..."
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        {loading && (
          <Loader2
            size={17}
            className="shrink-0 animate-spin text-indigo-500"
          />
        )}

        {query && !loading && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setError("");
            }}
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
              ["documents", "Documents"],
              ["folders", "Folders"],
              ["users", "People"],
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

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center gap-2 px-4 py-8">
              <Loader2
                size={18}
                className="animate-spin text-indigo-500"
              />

              <p className="text-sm text-slate-500">
                Searching...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                results.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                    onClick={() =>
                      handleResultClick(item)
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
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;