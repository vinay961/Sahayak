"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/header.js";
import { newsData } from "@/data/news";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export default function NewsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [cardsToShow, setCardsToShow] = useState({});
  const [expandedNews, setExpandedNews] = useState({});

  const categories = ["All", "Science", "Economy", "Environment", "Finance", "Employment", "Defense", "National"];

  // Months sorted descending
  const months = useMemo(() => {
    const monthSet = new Set();
    newsData.forEach(n => monthSet.add(n.month));
    return Array.from(monthSet).sort((a, b) => new Date(b) - new Date(a));
  }, []);

  // Group news by month → week
  const groupedNews = useMemo(() => {
    const group = {};
    newsData.forEach(n => {
      if (!group[n.month]) group[n.month] = {};
      if (!group[n.month][n.week]) group[n.month][n.week] = [];
      group[n.month][n.week].push(n);
    });
    return group;
  }, []);

  // Filtered news
  const filteredNews = useMemo(() => {
    const q = query.trim().toLowerCase();
    return newsData.filter(n => {
      const matchesCategory = category === "All" || n.category === category;
      const matchesQuery = n.title.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const toggleMonth = (month) => setExpandedMonths(prev => ({ ...prev, [month]: !prev[month] }));
  const toggleWeek = (month, week) => setExpandedWeeks(prev => ({ ...prev, [`${month}-${week}`]: !prev[`${month}-${week}`] }));
  const toggleReadMore = (id) => setExpandedNews(prev => ({ ...prev, [id]: !prev[id] }));
  const handleLoadMore = (month, week) => {
    const key = `${month}-${week}`;
    setCardsToShow(prev => ({ ...prev, [key]: (prev[key] || 3) + 3 }));
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen pt-20 pb-20">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 mt-1">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Weekly News Updates</h1>
          <p className="text-lg sm:text-xl text-gray-200">
            Browse curated weekly news from the last 6 months. Stay informed with key updates.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center w-full md:w-1/3 bg-white rounded-xl shadow p-3">
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search news..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
          </div>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full md:w-60 bg-white border rounded-lg shadow px-4 py-2 text-gray-700"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* News Grid */}
        {months.map(month => {
          const monthNews = groupedNews[month] || {};
          return (
            <div key={month} className="mb-8">
              {/* Month Header */}
              <button
                onClick={() => toggleMonth(month)}
                className="w-full flex justify-between items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mb-4 font-semibold"
              >
                <span>{month}</span>
                {expandedMonths[month] ? <ChevronUp /> : <ChevronDown />}
              </button>

              {/* Weeks */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMonths[month] ? 'max-h-[2000px]' : 'max-h-0'}`}>
                {Object.keys(monthNews).map(week => {
                  const weekNews = monthNews[week].filter(n => filteredNews.includes(n));
                  const key = `${month}-${week}`;
                  const visibleCount = cardsToShow[key] || 3;

                  return (
                    <div key={week} className="bg-gray-50 p-4 rounded-xl shadow-inner mb-4">
                      {/* Week Header */}
                      <button
                        onClick={() => toggleWeek(month, week)}
                        className="text-gray-700 w-full flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg font-medium mb-2"
                      >
                        <span>{week}</span>
                        {expandedWeeks[key] ? <ChevronUp /> : <ChevronDown />}
                      </button>

                      {/* News Cards */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedWeeks[key] ? 'max-h-[5000px]' : 'max-h-0'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {weekNews.slice(0, visibleCount).map(news => (
                            <div key={news.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 sm:p-6 flex flex-col">
                              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{news.title}</h2>
                              <p className="text-sm text-gray-500 mb-2">{news.month} • {news.week} • {news.category}</p>

                              {/* Only show content if expanded */}
                              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedNews[news.id] ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                {expandedNews[news.id] && news.image && (
                                  <div className="mb-2">
                                    <Image
                                      src={news.image}
                                      alt={news.title}
                                      width={400}
                                      height={250}
                                      className="rounded-lg object-cover"
                                    />
                                  </div>
                                )}
                                {expandedNews[news.id] && news.description && (
                                  <p className="text-gray-600 mb-2">{news.description}</p>
                                )}
                              </div>

                              <button
                                onClick={() => toggleReadMore(news.id)}
                                className="mt-auto text-blue-600 hover:underline self-start"
                              >
                                {expandedNews[news.id] ? "Show Less" : "Read More"}
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Load More */}
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
        })}
      </section>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white py-4 shadow-inner z-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">&copy; 2025 Social Welfare Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-700">Home</Link>
            <Link href="/schemes" className="text-gray-600 hover:text-blue-700">Schemes</Link>
            <Link href="/news" className="text-gray-600 hover:text-blue-700">News</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-700">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
