import React from "react";
import "./AnimatedSearch.css";

export default function AnimatedSearch({ value, onChange, placeholder = "Search", id = "animated-search" }) {
  const handleChange = (e) => {
    if (typeof onChange === "function") onChange(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="animatedSearch">
      <form onSubmit={handleSubmit} aria-label="Search">
        <label htmlFor={id}>Search</label>
        <input
          id={id}
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          // pattern is kept lenient to not block controlled empty values
          pattern=".*\\S.*"
          required
        />
        <span className="caret" aria-hidden="true"></span>
      </form>
    </div>
  );
}
