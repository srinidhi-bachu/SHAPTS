import React, { useState, useEffect, useRef } from "react";

export default function AnimatedSearch({ value, onChange, placeholder = "Search", id }) {
  const [q, setQ] = useState(value || "");
  const inputRef = useRef(null);

  useEffect(() => { setQ(value || ""); }, [value]);
  useEffect(() => {
    const t = setTimeout(() => { onChange && onChange(q); }, 200); // tiny debounce
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'white', border: '1px solid #cbd5e1', borderRadius: 12,
      padding: '8px 12px', boxShadow: '0 2px 8px rgba(13,42,76,0.06)'
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M21 21l-4.35-4.35" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="10.5" cy="10.5" r="7" stroke="#64748b" strokeWidth="2"/>
      </svg>
      <input
        id={id}
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#0b2b4c' }}
      />
    </div>
  );
}
