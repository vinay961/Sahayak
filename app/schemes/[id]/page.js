"use client";
import Image from "next/image";
import { use, useState } from "react";

const schemesData = [
  {
    id: 101,
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    category: "Agriculture / Farmers Welfare",
    launchDate: "February 2019",
    image: "/schemes/pm-kisan.jpg",
    descriptionPoints: [
      { en: "Provides ₹6,000/year income support to farmers.", hi: "किसानों को प्रति वर्ष ₹6,000 की सहायता।" },
      { en: "Paid in 3 installments of ₹2,000.", hi: "3 किस्तों में ₹2,000।" },
    ],
    eligibility: [
      { en: "Small & marginal farmers with cultivable land.", hi: "खेती योग्य भूमि वाले छोटे व सीमांत किसान।" },
    ],
    benefits: [
      { en: "Ensures financial stability for farmers.", hi: "किसानों की वित्तीय स्थिरता सुनिश्चित।" },
    ],
  },
];

export default function SchemeDetail({ params }) {
  const { id } = use(params);
  const scheme = schemesData.find((s) => s.id.toString() === id);
  const [lang, setLang] = useState("en");

  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 text-center text-sm sm:text-base">
          Scheme not found.
        </p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#f8fafc] min-h-screen flex flex-col">
      {/* Sticky Header */}
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

      {/* Main */}
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
        <div className="mb-6">
          <Image
            src={scheme.image}
            alt={scheme.title}
            width={1000}
            height={600}
            className="rounded-xl shadow w-full h-64 sm:h-[400px] object-cover"
          />
        </div>

        {/* Highlights */}
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

        {/* Eligibility */}
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

        {/* Benefits */}
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
