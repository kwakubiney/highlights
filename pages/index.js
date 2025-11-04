import { useEffect, useState } from "react";

export default function Home() {
  const [highlights, setHighlights] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState("all");
  const [displayCount, setDisplayCount] = useState(20);
  const highlightsPerLoad = 20;

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/highlights.json`)
      .then(res => res.json())
      .then(setHighlights);
  }, []);

  const books = [...new Set(highlights.map(h => h.bookTitle))].sort();

  const filtered = highlights
    .filter(h => {
      const matchesSearch = h.highlight.toLowerCase().includes(query.toLowerCase()) ||
                           (h.note && h.note.toLowerCase().includes(query.toLowerCase()));
      const matchesBook = selectedBook === "all" || h.bookTitle === selectedBook;
      return matchesSearch && matchesBook;
    })
    .sort((a, b) => b.createdDate - a.createdDate);

  const visibleHighlights = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  useEffect(() => {
    setDisplayCount(20);
  }, [query, selectedBook]);

  const getColorTag = (colorCode) => {
    const colors = {
      1: { bg: "#fef3c7", text: "#92400e", label: "Yellow" },
      2: { bg: "#d1fae5", text: "#065f46", label: "Green" },
      3: { bg: "#e9d5ff", text: "#6b21a8", label: "Purple" },
      4: { bg: "#fed7aa", text: "#9a3412", label: "Orange" },
    };
    return colors[colorCode] || colors[4];
  };

  const formatDate = (timestamp) => {
    // Apple Books stores dates as seconds since 2001-01-01 (macOS/Apple reference time)
    // Convert to milliseconds since Unix epoch (1970-01-01)
    const appleEpoch = new Date(2001, 0, 1).getTime();
    const date = new Date(appleEpoch + timestamp * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + highlightsPerLoad);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "1rem 1rem 4rem 1rem", overflowX: "hidden" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
        {/* Header - Sticky on mobile */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", padding: "0.75rem 0", position: "sticky", top: 0, background: "#f8fafc", zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)", fontWeight: "600", margin: "0 0 0.25rem 0", color: "#0f172a" }}>
              Kwaku's Highlights
            </h1>
            <p style={{ margin: "0", color: "#64748b", fontSize: "0.7rem" }}>
              {filtered.length} highlight{filtered.length !== 1 ? 's' : ''} • {books.length} book{books.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search & Filter - Full width stack on mobile */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.375rem", fontWeight: "600", color: "#334155", fontSize: "0.75rem" }}>
                Search
              </label>
              <input
                style={{ padding: "0.625rem 0.875rem", width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "1rem", outline: "none", transition: "all 0.2s", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                placeholder="Search highlights..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.375rem", fontWeight: "600", color: "#334155", fontSize: "0.75rem" }}>
                Filter by Book
              </label>
              <select
                style={{ padding: "0.625rem 0.875rem", width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "1rem", outline: "none", cursor: "pointer", background: "white", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                value={selectedBook}
                onChange={e => setSelectedBook(e.target.value)}
              >
                <option value="all">All {books.length} Books</option>
                {books.map(book => (
                  <option key={book} value={book}>{book} ({highlights.filter(h => h.bookTitle === book).length})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {visibleHighlights.map((h, i) => {
          const colorTag = getColorTag(h.color);
          return (
            <div key={i} style={{ background: "white", borderRadius: "12px", padding: "1rem", marginBottom: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", position: "relative", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.125rem 0", fontSize: "clamp(0.9rem, 2.5vw, 1rem)", fontWeight: "600", color: "#1e293b" }}>{h.bookTitle}</h3>
                  {h.author && h.author !== "Unknown Author" && (
                    <p style={{ margin: "0", fontSize: "0.75rem", color: "#64748b" }}>{h.author}</p>
                  )}
                </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ background: colorTag.bg, color: colorTag.text, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "600", whiteSpace: "nowrap" }}>{colorTag.label}</span>
                  {h.note && (<span data-note-indicator style={{ background: "#eff6ff", color: "#1e40af", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "500" }} title="Has note">Note</span>)}
                  <span style={{ color: "#94a3b8", fontSize: "0.7rem", marginLeft: "auto" }}>{formatDate(h.createdDate)}</span>
                </div>
              </div>
              <p style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)", lineHeight: "1.6", color: "#334155", margin: "0.75rem 0 0 0", fontWeight: "400" }}>"{h.highlight}"</p>
              {h.note && (
                <div style={{ margin: "0.75rem 0 0 0", padding: "0.75rem", background: "#f8fafc", borderLeft: "3px solid #3b82f6", borderRadius: "6px", fontSize: "0.8rem", color: "#475569", fontStyle: "italic" }}>
                  <strong style={{ fontStyle: "normal", color: "#1e40af" }}>Note:</strong> {h.note}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ background: "white", borderRadius: "12px", padding: "2rem 1rem", textAlign: "center", color: "#64748b", border: "1px solid #e2e8f0" }}>
            <p style={{ margin: "0", fontSize: "0.95rem" }}>No highlights found matching your filters</p>
          </div>
        )}

        {hasMore && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem", paddingBottom: "1rem" }}>
            <button 
              onClick={loadMore}
              style={{ 
                padding: "0.75rem 2rem", 
                border: "1px solid #e2e8f0", 
                borderRadius: "8px", 
                background: "white", 
                color: "#334155", 
                cursor: "pointer", 
                fontWeight: "500", 
                fontSize: "0.875rem", 
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={(e) => { 
                e.target.style.background = "#3b82f6"; 
                e.target.style.color = "white"; 
                e.target.style.borderColor = "#3b82f6";
              }}
              onMouseLeave={(e) => { 
                e.target.style.background = "white"; 
                e.target.style.color = "#334155";
                e.target.style.borderColor = "#e2e8f0";
              }}
            >
              Load More ({filtered.length - displayCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
