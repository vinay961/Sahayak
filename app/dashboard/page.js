"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, Newspaper, Leaf } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("news");

  const sampleNews = [
    {
      id: 1,
      title: "Green Bharat Mission Launched",
      category: "Environment / National",
      month: "September 2025",
      date: "September 18, 2025",
    },
    {
      id: 2,
      title: "PM Inaugurates Smart Agriculture Drive",
      category: "Agriculture / Farmers Welfare",
      month: "August 2025",
      date: "August 10, 2025",
    },
  ];

  const sampleSchemes = [
    {
      id: 101,
      title: "PM-KISAN Yojana",
      category: "Farmers Welfare",
      launchDate: "February 2019",
    },
    {
      id: 102,
      title: "Soil Health Card Scheme",
      category: "Agriculture",
      launchDate: "2015",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-6">
        <button
          onClick={() => setActiveTab("news")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === "news" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
          }`}
        >
          <Newspaper size={18} /> News
        </button>

        <button
          onClick={() => setActiveTab("schemes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === "schemes" ? "bg-green-100 text-green-700" : "text-gray-600 hover:text-green-600"
          }`}
        >
          <Leaf size={18} /> Schemes
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Date</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "news" ? sampleNews : sampleSchemes).map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition-all duration-150"
              >
                <td className="p-3">{item.id}</td>
                <td className="p-3 font-medium text-gray-800">{item.title}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
