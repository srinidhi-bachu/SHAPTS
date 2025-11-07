import React, { useEffect, useState } from "react";

export default function AmbulanceButton({ label = "Proceed", successLabel = "Done", canStart = () => true, onComplete }) {
  const [state, setState] = useState("idle"); // idle | running | success

  useEffect(() => {
    if (state !== "running") return;
    const t = setTimeout(() => {
      setState("success");
      try { onComplete && onComplete(); } catch {}
      // Reset back to idle after showing success briefly
      setTimeout(() => setState("idle"), 800);
    }, 800);
    return () => clearTimeout(t);
  }, [state]);

  const start = () => {
    if (state === "running" || !canStart()) return;
    setState("running");
  };

  const bg = state === "running" ? "linear-gradient(90deg, #34d399, #10b981)" : state === "success" ? "#10b981" : "#2563eb";

  return (
    <button
      onClick={start}
      disabled={state === "running" || (state === "idle" && !canStart())}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', color: 'white',
        background: bg, cursor: state === "running" ? 'default' : 'pointer', transition: 'filter 160ms ease'
      }}
    >
      {state === "running" && (
        <span className="spin" style={{
          width: 14, height: 14, border: '2px solid rgba(255,255,255,0.5)', borderTopColor: 'white', borderRadius: '50%',
          display: 'inline-block', animation: 'amb-spin 1s linear infinite'
        }} />
      )}
      <span>{state === "success" ? successLabel : label}</span>
      <style>{`@keyframes amb-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </button>
  );
}
