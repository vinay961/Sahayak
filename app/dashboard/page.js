"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Newspaper, Leaf, Search } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("news");
  const [newsData, setNewsData] = useState([]);
  const [schemesData, setSchemesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [weekFilter, setWeekFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  // Fetch Data
  useEffect(() => {
    fetch("/api/news").then(res => res.json()).then(setNewsData);
    fetch("/api/schemes").then(res => res.json()).then(setSchemesData);
  }, []);

  const currentData = activeTab === "news" ? newsData : schemesData;

  // Extract unique months and weeks dynamically
  const months = useMemo(() => {
    const allMonths = currentData.map(item => item.month).filter(Boolean);
    return ["All", ...new Set(allMonths)];
  }, [currentData]);

  const weeks = useMemo(() => {
    const allWeeks = currentData.map(item => item.week).filter(Boolean);
    return ["All", ...new Set(allWeeks)];
  }, [currentData]);

  // Filtered Data
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return currentData.filter(item => {
      const matchesQuery =
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesMonth = monthFilter === "All" || item.month === monthFilter;

      const matchesWeek = weekFilter === "All" || item.week === weekFilter;

      return matchesQuery && matchesCategory && matchesMonth && matchesWeek;
    });
  }, [searchQuery, categoryFilter, monthFilter, weekFilter, currentData]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddClick = () => {
    router.push(
      activeTab === "news" ? "/dashboard/add-news" : "/dashboard/add-scheme"
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const categories =
    activeTab === "news"
      ? ["All", "Economy", "Science", "National", "Defense", "Education", "Environment"]
      : ["All", "Agriculture", "Welfare", "Health", "Employment"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b pb-3 mb-6">
        <button
          onClick={() => {
            setActiveTab("news");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            activeTab === "news"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          <Newspaper size={18} /> News
        </button>
        <button
          onClick={() => {
            setActiveTab("schemes");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            activeTab === "schemes"
              ? "bg-green-100 text-green-700"
              : "text-gray-600 hover:text-green-600"
          }`}
        >
          <Leaf size={18} /> Schemes
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex items-center bg-white shadow rounded-xl px-4 py-2 w-full">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-gray-700 bg-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border shadow rounded-xl px-4 py-2 text-gray-700 w-full"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* Month Filter */}
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="bg-white border shadow rounded-xl px-4 py-2 text-gray-700 w-full"
        >
          {months.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        {/* Week Filter */}
        <select
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
          className="bg-white border shadow rounded-xl px-4 py-2 text-gray-700 w-full"
        >
          {weeks.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full min-w-[600px]">
            <thead className="sticky top-0 bg-gray-100 text-gray-700 text-xs sm:text-sm uppercase z-10">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">
                  {activeTab === "news" ? "Date" : "Launch Date"}
                </th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition-all text-sm sm:text-base"
                  >
                    <td className="p-3 text-gray-600">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 font-medium text-gray-800 truncate max-w-[250px]">
                      {item.title}
                    </td>
                    <td className="p-3 text-gray-600">{item.category}</td>
                    <td className="p-3 text-gray-500">
                      {activeTab === "news" ? item.date : item.launchDate}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
