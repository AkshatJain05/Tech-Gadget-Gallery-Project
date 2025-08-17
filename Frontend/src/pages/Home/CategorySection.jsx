import  { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import headphoneImg from "../../assets/headphone.png";

// Optional: fallback icons/images by name (can be CDN urls)
const circleBgByCategory = (name) => {
  // deterministic pastel from string
  const colors = ["bg-rose-100","bg-emerald-100","bg-violet-100","bg-amber-100","bg-sky-100","bg-lime-100","bg-fuchsia-100"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function CategoriesStrip() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const scrollerRef = useRef(null);
  const API = import.meta.env.VITE_API_URL
  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API}/api/user/categories`, { withCredentials: true })
      .then((res) => {
        const data = Array.isArray(res.data?.categories) ? res.data.categories : res.data;
        if (mounted) setCats(data || []);
      })
      .catch((e) => setErr(e?.response?.data?.message || "Failed to load categories"))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);


  
  const scrollBy = (delta) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="flex gap-4 py-3 px-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-12 h-3 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
        {err}
      </div>
    );
  }

  if (!cats.length) return null;

  return (
    <section aria-label="Shop by category" className="relative w-full  px-[5%]">
      {/* Title row */}
      <div className="flex items-center justify-between mb-2 px-1 sm:px-2">
        <h2 className="text-base sm:text-lg font-semibold">Categories</h2>
        {/* Arrow buttons hidden on small screens to keep UI minimal */}
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scrollBy(-320)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-50"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            onClick={() => scrollBy(320)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-50"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      {/* One-line horizontal scroller */}
      <div
        ref={scrollerRef}
        className="
          flex gap-4 sm:gap-6 px-1 sm:px-2 py-2
          overflow-x-auto no-scrollbar
          snap-x snap-mandatory
        "
        role="list"
      >
        {cats.map((name) => {
          const display = String(name);
          const slug = encodeURIComponent(display);
          return (
            <Link
              role="listitem"
              key={display}
              to={`/category/${slug}`}
              className="flex flex-col items-center gap-2 shrink-0 snap-start"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${circleBgByCategory(display)} 
                border border-black/5 shadow-sm grid place-items-center transition-transform hover:scale-105 overflow-hidden`}
              >
                {/* Show image if available, fallback to initials */}
                {name.image ? (
                  <img
                    src={name.image}
                    alt={display}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm sm:text-base font-semibold text-gray-700">
                    {display.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-sm text-gray-700 line-clamp-1 max-w-24 text-center">
                {display}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
