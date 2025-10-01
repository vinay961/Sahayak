"use client";
import { useState, useRef, useEffect } from "react";
import { schemes } from "@/data/schemes";
import { Search, X } from "lucide-react";
import Link from "next/link";

export default function SchemesPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [category, setCategory] = useState("All");
  const scrollRef = useRef(null);

  const categories = [
    "All",
    "Education",
    "Health",
    "Finance",
    "Women",
    "Employment",
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const filteredSchemes = schemes.filter((s) => {
    const q = debouncedQuery.trim().toLowerCase();
    const catNorm = category.toLowerCase();

    const title = (s.title || "").toLowerCase();
    const eligibility = (s.eligibility || "").toLowerCase();
    const benefits = (s.benefits || "").toLowerCase();
    const details = (s.details || "").toLowerCase();
    const schemeCat = (s.category || "").toLowerCase();

    const matchesCategory = catNorm === "all" || schemeCat === catNorm;
    if (!matchesCategory) return false;

    if (!q) return true;
    const combined = `${title} ${eligibility} ${benefits} ${details}`;
    return combined.includes(q);
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [debouncedQuery, category]);

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Government Schemes
          </h1>
          <p className="text-lg sm:text-xl text-gray-200">
            Explore the latest welfare schemes with details on eligibility,
            benefits, and updates. Stay informed and take advantage of
            opportunities that matter to you.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Search */}
          <div className="flex items-center w-full md:w-1/2 bg-white rounded-xl shadow p-3">
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
              aria-label="Search schemes"
              type="text"
              placeholder="Search schemes (title, eligibility, benefits)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="ml-2 p-1 rounded-md hover:bg-gray-100"
                title="Clear"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setQuery("");
                  }}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border hover:bg-blue-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={scrollRef} className="max-h-[600px] overflow-y-auto pr-2">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.length > 0 ? (
              // Sort schemes by date (latest first)
              filteredSchemes
                .slice() // create a copy so original array is not mutated
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border-l-4 border-blue-600 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {scheme.title}
                        </h2>
                        <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                          {scheme.category || "Uncategorized"}
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mb-2">
                        <strong>Date:</strong>{" "}
                        {new Date(scheme.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>

                      <p className="text-gray-600 mb-2">
                        <strong>Eligibility:</strong>{" "}
                        {scheme.eligibility || "—"}
                      </p>

                      <p className="text-gray-600 mb-4">
                        <strong>Benefits:</strong> {scheme.benefits || "—"}
                      </p>
                    </div>

                    <Link
                      href={`/schemes/${scheme.id}`}
                      className="mt-auto inline-block text-blue-600 font-semibold hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-500">
                  No schemes found — try different keywords or category.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">
            &copy; 2025 Social Welfare Platform. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-700">
              Home
            </Link>
            <Link href="/schemes" className="text-gray-600 hover:text-blue-700">
              Schemes
            </Link>
            <Link href="/news" className="text-gray-600 hover:text-blue-700">
              News
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-700">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
