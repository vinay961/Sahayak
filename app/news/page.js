"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { newsData } from "@/data/news";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/header.js";
import { Search, ChevronDown } from "lucide-react";

function CustomDropdown({ options, selected, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full md:w-60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-gray-700 bg-white border rounded-lg shadow px-4 py-2 text-left flex justify-between items-center hover:border-blue-400"
      >
        <span>{selected || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>

      {open && (
        <ul className="absolute mt-1 w-full bg-white border rounded-lg shadow max-h-60 overflow-y-auto z-50">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`px-4 py-2 text-gray-700 cursor-pointer hover:bg-blue-600 hover:text-white ${
                selected === opt ? "bg-blue-100" : ""
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function NewsPage() {
  const today = new Date();
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [category, setCategory] = useState("All");

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  }).reverse();

  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const monthWeekOptions = months.flatMap((month) =>
    weeks.map((week) => `${month} - ${week}`)
  );

  const currentWeekNumber = Math.ceil(today.getDate() / 7);
  const currentMonth = today.toLocaleString("default", { month: "long", year: "numeric" });
  const currentWeek = `Week ${currentWeekNumber}`;
  const currentFilter = `${currentMonth} - ${currentWeek}`;

  useEffect(() => {
    setSelectedFilter(currentFilter);
  }, [currentFilter]);

  const filteredNews = useMemo(() => {
    const q = query.trim().toLowerCase();
    return newsData.filter((news) => {
      const matchesFilter = selectedFilter
        ? `${news.month} - ${news.week}` === selectedFilter
        : true;

      const matchesCategory = category === "All" || news.category === category;

      const matchesQuery =
        news.title.toLowerCase().includes(q) ||
        news.description.toLowerCase().includes(q);

      return matchesFilter && matchesCategory && matchesQuery;
    });
  }, [selectedFilter, category, query]);

  const categories = ["All", "Science", "Economy", "Environment", "Finance", "Employment", "Defense", "National"];

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Header />
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Weekly News Updates</h1>
          <p className="text-lg sm:text-xl text-gray-200">
            Browse curated weekly news from the last 6 months. Stay informed with key updates.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Search */}
          <div className="flex items-center w-full md:w-1/3 bg-white rounded-xl shadow p-3">
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full outline-none text-gray-700 hover:placeholder-gray-500 bg-transparent"
            />
          </div>

          {/* Category Dropdown */}
          <CustomDropdown
            options={categories}
            selected={category}
            onChange={(value) => setCategory(value)}
            placeholder="Select Category"
          />

          {/* Month-Week Dropdown */}
          <CustomDropdown
            options={monthWeekOptions}
            selected={selectedFilter}
            onChange={(value) => setSelectedFilter(value)}
            placeholder="Select Week"
          />
        </div>

        {/* News Grid */}
        <div className="max-h-[600px] overflow-y-auto pr-2">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.length > 0 ? (
              filteredNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6"
                >
                  <Image
                    src={news.image}
                    alt={news.title}
                    width={400}
                    height={250}
                    className="rounded-lg mb-4 object-cover"
                  />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{news.title}</h2>
                  <p className="text-gray-600 mb-3">{news.description}</p>
                  <p className="text-sm text-gray-500">
                    {news.month} • {news.week} • {news.category}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No news found for this selection.
              </p>
            )}
          </div>
        </div>
      </section>

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
