"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* localStorage helpers */
function readStudiedFromLocal() {
  try {
    return JSON.parse(localStorage.getItem("studiedNews") || "[]");
  } catch {
    return [];
  }
}
function saveStudiedToLocal(arr) {
  try {
    localStorage.setItem("studiedNews", JSON.stringify(arr));
  } catch {}
}

/* --- Compact SVG icons (inline) --- */
function IconCheck({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconInfo({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconPrev({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconNext({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconClose({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconExternal({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 3h7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 21H3V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --- Page component --- */
export default function NewsResults() {
  // replaced useSearchParams with a simple URLSearchParams state
  const router = useRouter();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studiedIds, setStudiedIds] = useState(() => readStudiedFromLocal());

  // modal / focus view state
  const [selectedIndex, setSelectedIndex] = useState(null); // index into filtered array
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ------------------------
  // URL params handling (simple beginner-friendly replacement)
  // ------------------------
  // Initialize from current location (guarded for SSR safety)
  const [params, setParams] = useState(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  });

  // Keep params in sync with browser navigation (back/forward)
  useEffect(() => {
    const onPop = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // helpers to read values (same as searchParams.get)
  const month = (params.get("month") || "").toString();
  const week = (params.get("week") || "").toString();
  const category = (params.get("category") || "").toString();
  const q = (params.get("q") || "").trim().toLowerCase();

  // ------------------------
  // data fetching + local storage
  // ------------------------
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => mounted && setNews(data || []))
      .catch((e) => {
        console.error("Failed to fetch news", e);
        mounted && setNews([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    saveStudiedToLocal(studiedIds);
  }, [studiedIds]);

  const filtered = useMemo(() => {
    if (!news) return [];
    return news.filter((n) => {
      if (month && n.month !== month) return false;
      if (week && n.week !== week) return false;
      if (category && category !== "All" && n.category !== category) return false;
      if (q) {
        const title = (n.title || "").toLowerCase();
        const sum = (n.summary?.en || "").toLowerCase();
        const desc = (n.description || "").toLowerCase();
        if (!(title.includes(q) || sum.includes(q) || desc.includes(q))) return false;
      }
      return true;
    });
  }, [news, month, week, category, q]);

  // grouping by month -> week
  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((n) => {
      g[n.month] = g[n.month] || {};
      g[n.month][n.week] = g[n.month][n.week] || [];
      g[n.month][n.week].push(n);
    });
    return g;
  }, [filtered]);

  const totalCount = filtered.length;
  const completedCount = filtered.filter((n) => studiedIds.includes(n._id || n.id)).length;
  const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const toggleStudied = (id) => {
    setStudiedIds((prev) => {
      const exists = prev.includes(id);
      return exists ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  // ---------- Modal helpers ----------
  const openModalAt = (index) => {
    if (index == null || index < 0 || index >= filtered.length) return;
    setSelectedIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIndex(null);
  };
  const showPrev = () => {
    if (selectedIndex == null) return;
    setSelectedIndex((i) => Math.max(0, i - 1));
  };
  const showNext = () => {
    if (selectedIndex == null) return;
    setSelectedIndex((i) => Math.min(filtered.length - 1, i + 1));
  };

  // keyboard navigation for modal (Esc / ← / →)
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, selectedIndex, filtered.length]);

  const currentItem = selectedIndex != null ? filtered[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-6xl mx-auto p-3 sm:p-4 flex items-center justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/news")}
              className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-200 text-sm bg-white hover:shadow"
              aria-label="Refine search"
              title="Refine search"
            >
              <IconPrev className="w-4 h-4 rotate-180" /> <span className="hidden md:inline">Refine</span>
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-base sm:text-lg font-semibold">Study Session Results</h2>
            <div className="text-xs text-slate-600">
              {month && <span>{month} </span>}
              {week && <span>• {week} </span>}
              {category && <span>• {category} </span>}
              {q && <span>• “{q}”</span>}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-600">Progress</div>
            <div className="w-28 sm:w-36 bg-slate-200 rounded-full h-2 mt-1 overflow-hidden">
              <div
                style={{ width: `${completionRate}%` }}
                className="h-2 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
              />
            </div>
            <div className="text-xs text-slate-500 mt-1 hidden sm:block">{completedCount}/{totalCount} done</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading news…</div>
        ) : totalCount === 0 ? (
          <div className="text-center py-12 text-slate-600">No results — try relaxing filters.</div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Found {totalCount} item{totalCount>1?'s':''}</h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ids = filtered.map((n) => n._id || n.id);
                    setStudiedIds((prev) => Array.from(new Set([...prev, ...ids])));
                  }}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded bg-emerald-600 text-white text-sm"
                  aria-label="Mark all as studied"
                  title="Mark all as studied"
                >
                  <IconCheck className="w-4 h-4" />
                  <span className="hidden md:inline">Mark all</span>
                </button>

                <button
                  onClick={() => {
                    const ids = filtered.map((n) => n._id || n.id);
                    setStudiedIds((prev) => prev.filter((id) => !ids.includes(id)));
                  }}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded border bg-white text-sm"
                  aria-label="Clear studied for this filter"
                  title="Clear studied for this filter"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="hidden md:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* groups */}
            <div className="space-y-5">
              {Object.keys(grouped).map((m) => (
                <section key={m} className="bg-white rounded-2xl shadow p-3 sm:p-4">
                  <h4 className="font-semibold mb-3 text-slate-900">{m}</h4>

                  {Object.keys(grouped[m]).map((wk) => {
                    const items = grouped[m][wk];
                    return (
                      <div key={wk} className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-medium text-slate-700">{wk}</div>
                          <div className="text-xs text-slate-500">
                            {items.length} item{items.length>1?'s':''}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {items.map((item) => {
                            const indexInFiltered = filtered.findIndex((f) => (f._id || f.id) === (item._id || item.id));
                            const id = item._id || item.id;
                            const done = studiedIds.includes(id);
                            const priority = item.priority || (item.category === "National" ? "High" : "Normal");
                            return (
                              <article
                                key={id}
                                className={`p-3 rounded-lg flex items-start gap-3 border ${
                                  done ? "bg-slate-50 border-slate-200" : "bg-white border-slate-100"
                                }`}
                              >
                                <div className="flex-1 min-w-0">
                                  {/* Title no longer truncated — wraps naturally so the full title is visible */}
                                  <h5 className={`font-medium break-words ${done ? "line-through text-slate-500" : "text-slate-900"}`}>
                                    {item.title}
                                  </h5>
                                  <div className="text-xs text-slate-500 mt-1">
                                    {item.month} • {item.week} • {item.category}
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-slate-700 mt-2 line-clamp-3">{item.description}</p>
                                  )}
                                </div>

                                {/* compact action column with hover tooltips (title attr + small CSS tooltip) */}
                                <div className="flex flex-col items-end gap-2">
                                  <button
                                    onClick={() => toggleStudied(id)}
                                    aria-label={done ? "Unmark studied" : "Mark studied"}
                                    title={done ? "Unmark studied" : "Mark studied"}
                                    className={`p-2 rounded ${done ? "bg-slate-200 text-slate-700" : "bg-blue-600 text-white"}`}
                                  >
                                    <IconCheck className="w-4 h-4" />
                                  </button>

                                  <div className="relative group">
                                    <button
                                      onClick={() => openModalAt(indexInFiltered)}
                                      aria-label="Study details"
                                      title="Study details"
                                      className="p-2 rounded border bg-white"
                                    >
                                      <IconInfo className="w-4 h-4" />
                                    </button>

                                    {/* desktop-enhanced tooltip */}
                                    <div className="absolute right-1 top-full mt-2 hidden group-hover:block">
                                      <div className="px-2 py-1 bg-slate-800 text-white text-xs rounded">Details</div>
                                    </div>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </section>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ---------- Modal / Focus view (mobile-first) ---------- */}
      {isModalOpen && currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />

          <div className="relative z-10 w-full sm:max-w-3xl sm:rounded-2xl bg-white shadow-2xl sm:overflow-hidden sm:max-h-[80vh]">
            {/* header */}
            <div className="flex items-start justify-between p-3 sm:p-4 border-b border-slate-100 gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500">{currentItem.month} • {currentItem.week} • {currentItem.category}</div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">
                  {currentItem.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStudied(currentItem._id || currentItem.id)}
                  className={`px-2 py-1 rounded text-sm ${studiedIds.includes(currentItem._id || currentItem.id) ? "bg-slate-200" : "bg-blue-600 text-white"}`}
                  aria-label="Toggle studied"
                  title="Toggle studied"
                >
                  <IconCheck className="w-4 h-4 inline" />
                </button>

                <button
                  onClick={closeModal}
                  className="p-2 rounded border bg-white"
                  aria-label="Close details"
                  title="Close details"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              {currentItem.image && (
                <div className="mb-4">
                  <img src={currentItem.image} alt={currentItem.title} className="w-full rounded-md object-cover" />
                </div>
              )}

              {currentItem.summary?.en ? (
                <div className="prose max-w-none text-slate-700">
                  <div dangerouslySetInnerHTML={{ __html: currentItem.summary.en }} />
                </div>
              ) : currentItem.description ? (
                <p className="text-slate-700">{currentItem.description}</p>
              ) : (
                <p className="text-slate-600">No detailed content available for this item.</p>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="text-sm text-slate-500 hidden sm:block">
                {selectedIndex + 1} / {filtered.length}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={showPrev}
                  disabled={selectedIndex === 0}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded border bg-white disabled:opacity-50"
                  aria-label="Previous item"
                  title="Previous"
                >
                  <IconPrev /> <span className="hidden sm:inline">Prev</span>
                </button>

                <button
                  onClick={showNext}
                  disabled={selectedIndex === filtered.length - 1}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded border bg-white disabled:opacity-50"
                  aria-label="Next item"
                  title="Next"
                >
                  <span className="hidden sm:inline">Next</span> <IconNext />
                </button>

                <button
                  onClick={() => {
                    router.push(`/news/${currentItem._id || currentItem.id}`);
                    closeModal();
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-indigo-600 text-white"
                  aria-label="Read on site"
                  title="Read on site"
                >
                  Read on site
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
