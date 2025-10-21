"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function NewsDetail({ params }) {
  const { id } = params;
  const [lang, setLang] = useState("en");
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const res = await fetch(`/api/news?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch news data");
        const data = await res.json();
        setNewsItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700 text-lg">
        ⏳ Loading news details...
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600 text-lg">
        ❌ {error || "News not found."}
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#f8fafc] min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow z-10 py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-xl font-bold text-gray-800">Sahayak News</h1>

        {/* Language Toggle */}
        <div className="flex items-center bg-gray-200 rounded-full overflow-hidden">
          {["en", "hi"].map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-5 py-1 text-sm font-medium transition ${
                lang === code
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              {code === "en" ? "English" : "हिंदी"}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-5 sm:px-8 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
          {newsItem.title}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          📅 {newsItem.date} &nbsp; | &nbsp; 🏷 {newsItem.category}
        </p>

        {/* Image */}
        {newsItem.image && (
          <img
            src={newsItem.image}
            alt={newsItem.title}
            width={1200}
            height={675}
            className="w-full h-auto rounded-2xl shadow-md mb-8"
          />
        )}

        {/* Summary */}
        <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
          {lang === "en" ? newsItem.summary.en : newsItem.summary.hi}
        </p>

        {/* Highlights */}
        <section className="bg-blue-50 border-l-4 border-blue-600 rounded-md p-5 mb-8">
          <h3 className="font-semibold text-blue-700 mb-3">
            {lang === "en" ? "Quick Highlights" : "मुख्य बिंदु"}
          </h3>
          <ul className="list-disc pl-6 text-gray-800 space-y-2 text-sm sm:text-base">
            {(lang === "en"
              ? newsItem.highlights.en
              : newsItem.highlights.hi
            ).map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Content */}
        <article className="space-y-5 text-gray-800 leading-relaxed text-justify">
          {(lang === "en"
            ? newsItem.content.en
            : newsItem.content.hi
          ).map((para, idx) => (
            <p key={idx} className="text-sm sm:text-base">
              {para}
            </p>
          ))}
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-gray-600 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} Sahayak News. All Rights Reserved.
      </footer>
    </div>
  );
}
