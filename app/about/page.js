"use client";
import Image from "next/image";
import Header from "../components/header.js";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            About <span className="text-yellow-300">Sahayak</span>
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            Your trusted digital companion for accessing government schemes,
            policies, and the latest national updates – anytime, anywhere.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">🎯 Our Mission</h3>
          <p className="text-gray-700 leading-relaxed">
            At <strong>Sahayak</strong>, our mission is to make government
            information more accessible, transparent, and user-friendly. We aim
            to bridge the gap between citizens and policies by delivering
            verified, structured updates in simple language.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">🌍 Our Vision</h3>
          <p className="text-gray-700 leading-relaxed">
            To empower every Indian citizen with reliable and timely information
            about government schemes, ensuring that no one is left behind in the
            journey of progress and development.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Why Choose <span className="text-blue-600">Sahayak?</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Verified Information",
                desc: "We provide structured and authentic updates directly sourced from government portals.",
                icon: "✔️",
              },
              {
                title: "Bilingual Support",
                desc: "Switch seamlessly between English and Hindi for better understanding.",
                icon: "🌐",
              },
              {
                title: "Modern & Simple",
                desc: "Clean, mobile-friendly design for a smooth user experience.",
                icon: "📱",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-blue-700 text-white text-center">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">
          Be Informed. Be Empowered.
        </h3>
        <p className="text-blue-200 max-w-2xl mx-auto mb-6">
          With Sahayak, you can stay updated on the latest government schemes,
          policies, and news that matter to you and your community.
        </p>
        <button className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition">
          Explore Schemes
        </button>
      </section>
    </div>
  );
}
