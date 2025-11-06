import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./FeedbackTab.css";

export default function FeedbackTab() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="pt-fb">
      <div className="pt-fb-hero">
        <DotLottieReact src="/stars.lottie" autoplay loop style={{ width: 140, height: 140 }} />
        <div>
          <h3>Rate your experience</h3>
          <p>Your feedback helps us improve.</p>
        </div>
      </div>

      <div className="pt-stars">
        {[1,2,3,4,5].map((i)=> (
          <button key={i} className={`star ${rating>=i?"on":""}`} onClick={()=>setRating(i)}>★</button>
        ))}
      </div>

      <textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
      />

      <div className="pt-fb-actions">
        <button onClick={()=> alert(`Submitted ${rating} stars: ${comment || "(no comment)"}`)}>Submit</button>
      </div>
    </div>
  );
}
