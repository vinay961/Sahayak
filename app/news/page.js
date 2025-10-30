"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Header from "../components/header.js";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [cardsToShow, setCardsToShow] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const categories = [
    "All",
    "Science",
    "Economy",
    "Environment",
    "Finance",
    "Employment",
    "Defense",
    "National",
  ];

  const fetchNewsData = async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      console.log(data);
      setNewsData(data);
    } catch (error) {
      console.error("Error fetching news data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  const months = useMemo(() => {
    const monthSet = new Set();
    newsData.forEach((n) => monthSet.add(n.month));
    return Array.from(monthSet).sort((a, b) => new Date(b) - new Date(a));
  }, [newsData]);

  const groupedNews = useMemo(() => {
    const group = {};
    newsData.forEach((n) => {
      if (!group[n.month]) group[n.month] = {};
      if (!group[n.month][n.week]) group[n.month][n.week] = [];
      group[n.month][n.week].push(n);
    });
    return group;
  }, [newsData]);

  const filteredNews = useMemo(() => {
    const q = query.trim().toLowerCase();
    return newsData.filter((n) => {
      const matchesCategory = category === "All" || n.category === category;
      const matchesQuery =
        n.title.toLowerCase().includes(q) ||
        n.summary?.en?.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category, newsData]);

  const toggleMonth = (month) =>
    setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));

  const toggleWeek = (month, week) =>
    setExpandedWeeks((prev) => ({
      ...prev,
      [`${month}-${week}`]: !prev[`${month}-${week}`],
    }));

  const handleLoadMore = (month, week) => {
    const key = `${month}-${week}`;
    setCardsToShow((prev) => ({ ...prev, [key]: (prev[key] || 3) + 3 }));
  };

  const handleReadMore = (id) => {
    router.push(`/news/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* 🔹 Main Content */}
      <main className="flex-1 pt-20 pb-20">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Stay Informed with Verified Updates
            </h1>
            <p className="text-lg sm:text-xl text-gray-200">
              Get the latest economy and national news summarized every week —
              accurate, reliable, and easy to read.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-10">
          {/* 🔍 Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center w-full md:w-1/3 bg-white rounded-xl shadow p-3">
              <Search className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Search news..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-60 bg-white border rounded-lg shadow px-4 py-2 text-gray-700"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 🌀 Loading Spinner Section */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : months.length === 0 ? (
            <p className="text-center text-gray-500">No news available.</p>
          ) : (
            months.map((month) => {
              const monthNews = groupedNews[month] || {};
              return (
                <div key={month} className="mb-8">
                  <button
                    onClick={() => toggleMonth(month)}
                    className="w-full flex justify-between items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mb-4 font-semibold"
                  >
                    <span>{month}</span>
                    {expandedMonths[month] ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      expandedMonths[month] ? "max-h-[2000px]" : "max-h-0"
                    }`}
                  >
                    {Object.keys(monthNews).map((week) => {
                      const weekNews = monthNews[week].filter((n) =>
                        filteredNews.includes(n)
                      );
                      const key = `${month}-${week}`;
                      const visibleCount = cardsToShow[key] || 3;

                      return (
                        <div
                          key={week}
                          className="bg-gray-50 p-4 rounded-xl shadow-inner mb-4"
                        >
                          <button
                            onClick={() => toggleWeek(month, week)}
                            className="text-gray-700 w-full flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg font-medium mb-2"
                          >
                            <span>{week}</span>
                            {expandedWeeks[key] ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                          </button>

                          <div
                            className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                              expandedWeeks[key]
                                ? "max-h-[5000px]"
                                : "max-h-0"
                            }`}
                          >
                            {/* ✅ Scrollable container on small screens */}
                            <div
                              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-2 ${
                                expandedWeeks[key] &&
                                visibleCount > 3
                                  ? "sm:max-h-none max-h-[500px] overflow-y-auto"
                                  : ""
                              }`}
                            >
                              {weekNews.slice(0, visibleCount).map((news) => (
                                <div
                                  key={news._id || news.id}
                                  className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 sm:p-6 flex flex-col"
                                >
                                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                    {news.title}
                                  </h2>
                                  <p className="text-sm text-gray-500 mb-2">
                                    {news.month} • {news.week} •{" "}
                                    {news.category}
                                  </p>

                                  {news.image && (
                                    <div className="mb-2">
                                      <img
                                        src={news.image}
                                        alt={news.title}
                                        width={400}
                                        height={250}
                                        className="rounded-lg object-cover"
                                      />
                                    </div>
                                  )}

                                  {(news.description || news.summary?.en) && (
                                    <p className="text-gray-600 mb-2 line-clamp-3">
                                      {news.description || news.summary?.en}
                                    </p>
                                  )}

                                  <button
                                    onClick={() =>
                                      handleReadMore(news._id || news.id)
                                    }
                                    className="mt-auto text-blue-600 hover:underline self-start"
                                  >
                                    Read More →
                                  </button>
                                </div>
                              ))}
                            </div>

                            {visibleCount < weekNews.length && (
                              <div className="flex justify-center mt-4">
                                <button
                                  onClick={() => handleLoadMore(month, week)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                                >
                                  Load More
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      {/* 🔹 Footer */}
      <footer className="bg-white py-8 shadow-inner mt-auto">
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
