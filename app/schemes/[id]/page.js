"use client";
import { use, useState, useEffect } from "react";
import Image from "next/image";

export default function SchemeDetail({ params }) {
  const { id } = use(params);

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const res = await fetch(`/api/schemes?id=${id}`);
        if (!res.ok) throw new Error("Scheme not found");
        const data = await res.json();
        setScheme(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 text-center text-sm sm:text-base">
          {error || "Scheme not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#f8fafc] min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow z-10 py-3 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-lg font-bold text-gray-800">Sahayak News</h1>
        <div className="relative flex items-center bg-gray-200 rounded-lg p-1 w-36 sm:w-40">
          <div
            className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-blue-600 transition-all duration-300 ${
              lang === "en" ? "left-1" : "left-1/2"
            }`}
          />
          <button
            onClick={() => setLang("en")}
            className={`flex-1 text-sm font-medium z-10 py-1 ${
              lang === "en" ? "text-white" : "text-gray-700"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("hi")}
            className={`flex-1 text-sm font-medium z-10 py-1 ${
              lang === "hi" ? "text-white" : "text-gray-700"
            }`}
          >
            हिंदी
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {scheme.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            📅 {scheme.launchDate} | 🏷 {scheme.category}
          </p>
        </div>

        {/* Image */}
        {scheme.image && (
          <div className="mb-6">
            <img
              src={scheme.image}
              alt={scheme.title}
              width={1000}
              height={600}
              className="rounded-xl shadow w-full h-64 sm:h-[400px] object-cover"
            />
          </div>
        )}

        {/* Highlights */}
        {scheme.descriptionPoints && scheme.descriptionPoints.length > 0 && (
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              {lang === "en" ? "Key Highlights" : "मुख्य विशेषताएँ"}
            </h3>
            <ul className="grid gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
              {scheme.descriptionPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✔</span>
                  <span>{lang === "en" ? p.en : p.hi}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Eligibility */}
        {scheme.eligibility && scheme.eligibility.length > 0 && (
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              {lang === "en" ? "Eligibility" : "पात्रता"}
            </h3>
            <div className="bg-white shadow rounded-xl p-4 sm:p-6">
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                {scheme.eligibility.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✔</span>
                    <span>{lang === "en" ? rule.en : rule.hi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Benefits */}
        {scheme.benefits && scheme.benefits.length > 0 && (
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              {lang === "en" ? "Benefits" : "लाभ"}
            </h3>
            <div className="bg-white shadow rounded-xl p-4 sm:p-6">
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                {scheme.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✔</span>
                    <span>{lang === "en" ? b.en : b.hi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Note */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <p className="text-gray-700 text-sm sm:text-base">
            {lang === "en"
              ? "This scheme is officially launched by the Government of India. Details are verified for public awareness."
              : "यह योजना भारत सरकार द्वारा आधिकारिक रूप से शुरू की गई है। विवरण जनता की जागरूकता के लिए सत्यापित है।"}
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 sm:py-6 text-center text-gray-600 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} Sahayak News. All Rights Reserved.
      </footer>
    </div>
  );
}
