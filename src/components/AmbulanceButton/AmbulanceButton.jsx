import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import "./AmbulanceButton.css";

export default function AmbulanceButton({
  label = "Confirm booking",
  successLabel = "Booked",
  onComplete,
  canStart,
}) {
  const btnRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleClick = (e) => {
      e.preventDefault();
      if (btn.classList.contains("animating")) return;

      if (typeof canStart === "function" && !canStart()) {
        // invalid: subtle shake
        gsap.fromTo(
          btn,
          { x: 0 },
          { x: 6, yoyo: true, repeat: 5, duration: 0.06, ease: "power1.inOut" }
        );
        return;
      }

      const overlay = overlayRef.current;
      const car = overlay?.querySelector(".amb");
      const box = overlay?.querySelector(".amb-box");

      btn.classList.remove("done");
      btn.classList.add("animating");
      overlay.classList.add("show");

      // reset button progress and overlay vars
      gsap.set(btn, { "--progress": 0 });
      gsap.set(overlay, {
        "--amb-x": 0,
        "--amb-y": 0,
        "--box-o": 0,
        "--box-s": 0.5,
        "--bx": 0,
        "--hx": 0,
      });
      gsap.set(box, { x: -20, y: -6 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          btn.classList.remove("animating");
          btn.classList.add("done");
          overlay.classList.remove("show");
          if (typeof onComplete === "function") onComplete();
        },
      });

      tl.to(overlay, { "--box-s": 1, "--box-o": 1, duration: 0.3, delay: 0.2 })
        .to(box, { x: 0, duration: 0.35 }, "<0.2")
        .to(overlay, { "--hx": -4, "--bx": 50, duration: 0.2 }, ">-0.05")
        .to(box, { y: 0, duration: 0.12 }, ">-0.05")
        .to(overlay, { "--amb-y": -1, duration: 0.18 }, ">-0.02")
        .to(car, { x: 0, duration: 0.35 })
        .to(car, { x: 42, duration: 0.9 })
        .to(car, { x: 18, duration: 0.5 })
        .to(car, { x: 96, duration: 0.35 })
        .to(btn, { "--progress": 1, duration: 2.0, ease: "power2.in" }, "<-");
    };

    btn.addEventListener("click", handleClick);
    return () => btn.removeEventListener("click", handleClick);
  }, [onComplete, canStart]);

  return (
    <>
      <button className="amb-button" ref={btnRef} type="button">
        <span className="default">{label}</span>
        <span className="success">
          {successLabel}
          <svg viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
          </svg>
        </span>
        {/* Hide in-button vehicle during animation via CSS */}
        <div className="amb inbtn">
          <div className="wheel"></div>
          <div className="wheel front"></div>
          <div className="body">
            <div className="light"></div>
            <div className="cross"></div>
            <div className="window"></div>
          </div>
          <div className="amb-box"></div>
        </div>
      </button>

      {/* Full-page overlay vehicle shown during animation (portal to body) */}
      {typeof document !== "undefined" && createPortal(
        <div className="amb-overlay" ref={overlayRef} aria-hidden>
          <div className="amb">
            <div className="wheel"></div>
            <div className="wheel front"></div>
            <div className="body">
              <div className="light"></div>
              <div className="cross"></div>
              <div className="window"></div>
            </div>
            <div className="amb-box"></div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
