import React, { useEffect, useRef, useState } from "react";
import "../styles/ambulanceButton.css";

export default function AmbulanceButton({
  labelDefault = "Book",
  labelSuccess = "Booked",
  onComplete,
  size = "md",
}) {
  const [anim, setAnim] = useState(false);
  const [done, setDone] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleClick = (e) => {
    e.preventDefault();
    if (anim) return;
    setDone(false);
    setAnim(true);
    timeoutRef.current = setTimeout(() => {
      setDone(true);
      setAnim(false);
      if (onComplete) onComplete();
    }, 1800);
  };

  const cls = `amb-btn ${anim ? "anim" : ""} ${done ? "done" : ""} ${size}`;

  return (
    <button className={cls} onClick={handleClick} aria-live="polite">
      <span className="label default">{labelDefault}</span>
      <span className="label success">
        {labelSuccess}
        <svg viewBox="0 0 12 10" aria-hidden="true">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </svg>
      </span>
      <div className="amb">
        <div className="wheel" />
        <div className="cab" />
        <div className="box" />
        <div className="cross" />
      </div>
    </button>
  );
}
