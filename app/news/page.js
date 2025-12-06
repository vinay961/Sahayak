"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";

/* Presets unchanged */
const PRESETS = [
  { id: "monthly-deep", label: "Monthly Deep Dive", monthOnly: true, category: "" },
  { id: "week-quick", label: "This Week — Quick Scan", weekOnly: true, category: "" },
  { id: "economy-now", label: "Economy Focus", category: "Economy" },
  { id: "national-top", label: "National Headlines", category: "National" },
];

/* Small inline icons */
const IconSpark = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6.2 4.6l2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M2 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6.2 19.4l2.8-2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 18v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17.8 19.4l-2.8-2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M22 12h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17.8 4.6l-2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconMonth = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IconWeek = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IconCategory = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <path d="M14 14h6v6h-6z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default function NewsPicker() {
  const router = useRouter();

  const [newsMetaLoaded, setNewsMetaLoaded] = useState(false);
  const [months, setMonths] = useState([]);
  const [weeksByMonth, setWeeksByMonth] = useState({});
  const [categories, setCategories] = useState([]);

  const [month, setMonth] = useState("");
  const [week, setWeek] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(true);
  const [activePreset, setActivePreset] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const mSet = new Set();
        const catSet = new Set();
        const wMap = {};
        (data || []).forEach((item) => {
          if (item.month) {
            mSet.add(item.month);
            wMap[item.month] = wMap[item.month] || new Set();
            if (item.week) wMap[item.month].add(item.week);
          }
          if (item.category) catSet.add(item.category);
        });
        const monthsArr = Array.from(mSet).sort((a, b) => new Date(b) - new Date(a));
        const weeksObj = {};
        Object.entries(wMap).forEach(([m, s]) => (weeksObj[m] = Array.from(s)));
        setMonths(monthsArr);
        setWeeksByMonth(weeksObj);
        setCategories(["All", ...Array.from(catSet).sort()]);
        setNewsMetaLoaded(true);
      })
      .catch((e) => console.error("Failed to fetch news meta", e))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const applyPreset = (p) => {
    setActivePreset(p.id);
    if (p.monthOnly && months.length) {
      setMonth(months[0]);
      setWeek("");
    }
    if (p.weekOnly && months.length) {
      setMonth(months[0]);
      const fw = weeksByMonth[months[0]]?.[0] || "";
      setWeek(fw);
    }
    if (p.category) setCategory(p.category);
    // subtle visual feedback then submit
    setTimeout(() => submitStudy(), 160);
  };

  const submitStudy = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const params = new URLSearchParams();
    if (month) params.set("month", month);
    if (week) params.set("week", week);
    if (category) params.set("category", category);
    if (q) params.set("q", q.trim());
    router.push(`/news/results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <header className="py-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto relative">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 sm:p-10 shadow-xl transform-gpu">
            <div className="flex items-start gap-4">
              <div className="flex-none">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <IconSpark className="w-6 h-6 text-white/90" />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight">Focused Study — News Explorer</h1>
                <p className="mt-1 text-sm sm:text-base text-white/90 max-w-xl">
                  Choose a focused study plan by month, week or topic. Quick presets help when you are short on time.
                </p>
              </div>

              <div className="hidden md:flex flex-col items-end">
                <div className="text-xs text-white/80">Tip</div>
                <div className="mt-1 text-sm text-white font-medium">Save the results URL to resume later</div>
              </div>
            </div>
          </div>

          {/* floating glass card */}
          <div className="mt-4 sm:mt-6">
            <div className="bg-white/60 backdrop-blur rounded-2xl -translate-y-6 sm:-translate-y-8 p-4 sm:p-5 shadow-2xl border border-white/30">
              <form onSubmit={submitStudy} className="space-y-3">
                {/* Presets: animated chips (mobile full-width, md inline) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    {PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyPreset(p)}
                        title={p.label}
                        aria-label={p.label}
                        className={`rounded-full px-3 py-2 text-sm flex items-center gap-2 transition transform-gpu ${
                          activePreset === p.id
                            ? "bg-indigo-700 text-white shadow-md scale-100"
                            : "bg-white/90 text-slate-800 hover:scale-105"
                        }`}
                      >
                        <span className="hidden sm:inline">#{p.label.split(" ")[0]}</span>
                        <span className="sm:hidden text-xs">{p.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="hidden sm:block text-sm text-slate-700">Presets</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <label className="relative sm:col-span-1">
                    <div className="flex items-center gap-2 absolute left-3 top-3 text-slate-500 pointer-events-none">
                      <IconMonth className="w-4 h-4" />
                    </div>
                    <select
                      value={month}
                      onChange={(e) => {
                        setMonth(e.target.value);
                        setWeek("");
                        setActivePreset(null);
                      }}
                      className="pl-10 pr-3 py-3 w-full text-gray-800 rounded-lg bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-200"
                      disabled={loading || !newsMetaLoaded}
                      aria-label="Select month"
                      title="Select month"
                    >
                      <option value="">Any month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="relative sm:col-span-1">
                    <div className="flex items-center gap-2 absolute left-3 top-3 text-slate-500 pointer-events-none">
                      <IconWeek className="w-4 h-4" />
                    </div>
                    <select
                      value={week}
                      onChange={(e) => {
                        setWeek(e.target.value);
                        setActivePreset(null);
                      }}
                      disabled={!month}
                      className="pl-10 pr-3 py-3 w-full text-gray-800 rounded-lg bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
                      aria-label="Select week"
                      title="Select week"
                    >
                      <option value="">Any week</option>
                      {(weeksByMonth[month] || []).map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Category */}
                  <label className="relative sm:col-span-1">
                    <div className="flex items-center gap-2 absolute left-3 top-3 text-slate-500 pointer-events-none">
                      <IconCategory className="w-4 h-4" />
                    </div>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setActivePreset(null);
                      }}
                      className="pl-10 pr-3 py-3 w-full text-gray-800 rounded-lg bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-200"
                      disabled={loading}
                      aria-label="Select category"
                      title="Select category"
                    >
                      {(categories.length ? categories : ["All"]).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Keyword */}
                  <label className="relative sm:col-span-1">
                    <div className="flex items-center gap-2 absolute left-3 top-3 text-slate-500 pointer-events-none">
                      <IconSearch className="w-4 h-4" />
                    </div>
                    <input
                      value={q}
                      onChange={(e) => {
                        setQ(e.target.value);
                        setActivePreset(null);
                      }}
                      placeholder="Keyword"
                      aria-label="Search keyword"
                      title="Search keyword"
                      className="pl-10 pr-3 py-3 w-full text-gray-800 rounded-lg bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-200"
                    />
                  </label>
                </div>

                {/* CTA row */}
                <div className="flex items-center gap-3 justify-between">
                  <div className="text-xs text-slate-600">Options come from latest news meta</div>

                  <div className="ml-auto">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:brightness-105 transition"
                      aria-label="Start study session"
                      title="Start study session"
                    >
                      <span className="hidden sm:inline">Start Study Session</span>
                      <span className="sm:hidden">Study</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Content section: cards with tips (unchanged content but nicer) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mt-4">
          <article className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 transform-gpu hover:-translate-y-1 transition">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-block bg-indigo-50 rounded-full p-2">
                <IconSpark className="w-4 h-4 text-indigo-600" />
              </span>
              Why this helps
            </h3>
            <ul className="mt-3 text-sm text-slate-600 list-disc ml-5 space-y-1">
              <li>Short, focused sessions improve recall — study by month or week.</li>
              <li>Use presets to bootstrap a session quickly.</li>
              <li>Bookmark results to resume the same session later.</li>
            </ul>
          </article>

          <article className="bg-gradient-to-bl from-slate-800 to-slate-700 text-white rounded-2xl p-4 shadow-lg transform-gpu hover:-translate-y-1 transition">
            <h3 className="font-semibold">Quick tips</h3>
            <ul className="mt-3 text-sm space-y-1">
              <li>Tap a preset to start instantly.</li>
              <li>Combine month + keyword for targeted revision.</li>
              <li>Mark studied items on results to track progress.</li>
            </ul>
          </article>
        </section>
      </main>

      {/* Sticky CTA on mobile: visible only small screens for quick access */}
      <div className="fixed inset-x-4 bottom-5 sm:hidden z-40">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={submitStudy}>
            <button
              type="submit"
              className="w-full rounded-xl py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-xl flex items-center justify-center gap-3"
              aria-label="Start study session"
            >
              <span>Start Study</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
