"use client";
import Link from "next/link";
import Image from "next/image";
import Header from "./components/header.js";
import { schemes } from "@/data/schemes.js";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans bg-gray-50 min-h-screen relative">
      <Header className="sticky top-0 z-50 bg-white shadow-md" />

      <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-28 px-6 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-purple-200 rounded-full opacity-10 animate-pulse-slow delay-200"></div>
        <div className="absolute top-10 right-1/2 w-72 h-72 bg-yellow-200 rounded-full opacity-5 animate-pulse-slow delay-400"></div>

        <div className="relative max-w-5xl mx-auto text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fadeIn">
            Discover Government Schemes & Current Affairs
          </h1>
          <p className="text-lg sm:text-xl mb-6 text-gray-200 animate-fadeIn delay-200">
            Your one-stop platform to explore schemes, eligibility, benefits,
            and stay updated with the latest news.
          </p>
          <div className="flex justify-center sm:justify-start gap-4 animate-fadeIn delay-400">
            <Link
              href="/schemes"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              Explore Schemes
            </Link>
            <Link
              href="/news"
              className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 transition transform hover:scale-105"
            >
              Latest News
            </Link>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Why Use Our Platform?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <Image
              src="/icons/scheme.png"
              alt="Scheme Icon"
              width={64}
              height={64}
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-xl mb-2 text-gray-800">
              Explore Schemes
            </h3>
            <p className="text-gray-600">
              Get complete details about government schemes, eligibility, and
              benefits in one place.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <Image
              src="/icons/update.png"
              alt="News Icon"
              width={64}
              height={64}
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-xl mb-2 text-gray-800">
              Stay Updated
            </h3>
            <p className="text-gray-600">
              Read curated current affairs and news for exam prep or general
              awareness.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <Image
              src="/icons/exam.png"
              alt="Exam Icon"
              width={64}
              height={64}
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-xl mb-2 text-gray-800">
              Exam Preparation
            </h3>
            <p className="text-gray-600">
              Access structured content to help you prepare for government exams
              efficiently.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-gray-100 py-20 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Top Schemes
        </h2>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schemes.slice(0, 3).map((scheme) => (
            <div
              key={scheme.id}
              className="relative bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-30 pointer-events-none rounded-2xl"></div>

              <h3 className="text-xl font-semibold mb-2 text-gray-800 relative z-10">
                {scheme.title}
              </h3>
              <p className="text-gray-600 mb-1 relative z-10">
                <strong>Eligibility:</strong> {scheme.eligibility}
              </p>
              <p className="text-gray-600 mb-3 relative z-10">
                <strong>Benefits:</strong> {scheme.benefits}
              </p>
              <Link
                href={`/schemes/${scheme.id}`}
                className="text-blue-700 font-semibold hover:underline relative z-10"
              >
                View Details →
              </Link>

              <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t py-6 text-center text-gray-600 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} Sahayak News. All Rights Reserved.
      </footer>
    </div>
  );
}
