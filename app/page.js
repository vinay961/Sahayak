"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { schemes } from "@/data/schemes";
import Header from "./components/header.js";  
import Image from "next/image";

export default function Home() {

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Header />
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Discover Government Schemes & Current Affairs
          </h2>
          <p className="text-lg sm:text-xl mb-6 text-gray-200">
            Your one-stop platform to explore schemes, eligibility, benefits, and stay updated with the latest news for exam preparation or general knowledge.
          </p>
          <div className="flex justify-center sm:justify-start gap-4">
            <Link href="/schemes" className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition">
              Explore Schemes
            </Link>
            <Link href="/news" className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 transition">
              Latest News
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">Why Use Our Platform?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
            <Image src="/icons/scheme.png" alt="Scheme Icon" width={64} height={64} className="mx-auto mb-4" />
            <h4 className="font-semibold text-xl mb-2 text-gray-800">Explore Schemes</h4>
            <p className="text-gray-600">Get complete details about government schemes, eligibility, and benefits in one place.</p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
            <Image src="/icons/update.png" alt="News Icon" width={64} height={64} className="mx-auto mb-4" />
            <h4 className="font-semibold text-xl mb-2 text-gray-800">Stay Updated</h4>
            <p className="text-gray-600">Read curated current affairs and news for exam prep or general awareness.</p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
            <Image src="/icons/exam.png" alt="Exam Icon" width={64} height={64} className="mx-auto mb-4" />
            <h4 className="font-semibold text-xl mb-2 text-gray-800">Exam Preparation</h4>
            <p className="text-gray-600">Access structured content to help you prepare for government exams efficiently.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16 px-6">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Top Schemes</h3>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {schemes.slice(0, 3).map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
              <h4 className="text-xl font-semibold mb-2 text-gray-800">{scheme.title}</h4>
              <p className="text-gray-600 mb-1"><strong>Eligibility:</strong> {scheme.eligibility}</p>
              <p className="text-gray-600 mb-3"><strong>Benefits:</strong> {scheme.benefits}</p>
              <Link href={`/schemes/${scheme.id}`} className="text-blue-700 font-semibold hover:underline">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white py-8 mt-16 shadow-inner">
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
