"use client";
import Image from "next/image";
import { useState } from "react";

const newsData = [
  {
    id: 11,
    title: "PM launches 'Green Bharat' Mission for Climate Action",
    category: "Environment / National",
    month: "September 2025",
    week: "Week 3",
    date: "September 18, 2025",
    image: "https://moef.gov.in/uploads/2019/06/gim.jpg",
    summary: {
      en: "Prime Minister launched the 'Green Bharat' Mission with an ambitious target of planting 10 crore trees by 2030. The mission is part of India's broader climate action goals.",
      hi: "प्रधानमंत्री ने 'ग्रीन भारत' मिशन की शुरुआत की जिसका लक्ष्य 2030 तक 10 करोड़ पेड़ लगाने का है। यह मिशन भारत के जलवायु कार्रवाई लक्ष्यों का हिस्सा है।",
    },
    highlights: {
      en: [
        "10 crore trees to be planted by 2030",
        "₹15,000 crore allocated for renewable energy",
        "Focus on green jobs & rural employment",
      ],
      hi: [
        "2030 तक 10 करोड़ पेड़ लगाए जाएंगे",
        "नवीकरणीय ऊर्जा के लिए ₹15,000 करोड़ आवंटित",
        "ग्रीन जॉब्स और ग्रामीण रोजगार पर ध्यान",
      ],
    },
    content: {
      en: [
        "The Government of India has announced a massive initiative aimed at combating climate change through the 'Green Bharat' Mission. The mission seeks to promote afforestation and renewable energy innovation across the nation.",
        "With a budget allocation of ₹15,000 crore, the mission will support research in renewable technologies and encourage private and public participation.",
        "Officials highlighted that a special focus will be placed on creating rural employment opportunities through 'green jobs', ensuring that environmental sustainability also contributes to economic growth.",
        "Prime Minister, while launching the initiative, said: 'India is committed to a greener future. With this mission, we aim to empower communities while protecting our planet for future generations.'",
      ],
      hi: [
        "भारत सरकार ने 'ग्रीन भारत' मिशन के तहत जलवायु परिवर्तन से लड़ने के लिए एक बड़ा कदम उठाया है। यह मिशन पूरे देश में वनीकरण और नवीकरणीय ऊर्जा नवाचार को बढ़ावा देगा।",
        "₹15,000 करोड़ के बजट आवंटन के साथ, यह मिशन नवीकरणीय तकनीकों में अनुसंधान का समर्थन करेगा और निजी तथा सार्वजनिक भागीदारी को प्रोत्साहित करेगा।",
        "अधिकारियों ने बताया कि ग्रामीण रोजगार सृजन पर विशेष ध्यान दिया जाएगा, ताकि पर्यावरणीय स्थिरता आर्थिक विकास में भी योगदान दे सके।",
        "प्रधानमंत्री ने पहल शुरू करते हुए कहा: 'भारत एक हरित भविष्य के लिए प्रतिबद्ध है। इस मिशन से हम समुदायों को सशक्त करेंगे और आने वाली पीढ़ियों के लिए हमारे ग्रह की रक्षा करेंगे।'",
      ],
    },
  },
];

export default function NewsDetail({ params }) {
  const { id } = params;
  const newsItem = newsData.find((n) => n.id.toString() === id);
  const [lang, setLang] = useState("en");

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">News not found.</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#f8fafc] min-h-screen flex flex-col">
      <header className="sticky top-0 bg-white shadow z-10 py-3 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-lg font-bold text-gray-800">Sahayak News</h1>

        <div className="flex items-center bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setLang("en")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              lang === "en"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("hi")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              lang === "hi"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            हिंदी
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {newsItem.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">
          📅 {newsItem.date} | 🏷 {newsItem.category}
        </p>

        {/* Featured Image */}
        <Image
          src={newsItem.image}
          alt={newsItem.title}
          width={1200}
          height={675}
          className="w-full h-auto rounded-xl shadow-lg"
        />

        <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
          {lang === "en" ? newsItem.summary.en : newsItem.summary.hi}
        </p>

        <section className="bg-blue-50 border-l-4 border-blue-600 rounded-md p-4 mb-8">
          <h3 className="font-semibold text-blue-700 mb-2">
            {lang === "en" ? "Quick Highlights" : "मुख्य बिंदु"}
          </h3>
          <ul className="list-disc pl-6 text-gray-800 space-y-1 text-sm sm:text-base">
            {(lang === "en"
              ? newsItem.highlights.en
              : newsItem.highlights.hi
            ).map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Full Article */}
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

      <footer className="bg-white border-t py-6 text-center text-gray-600 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} Sahayak News. All Rights Reserved.
      </footer>
    </div>
  );
}
