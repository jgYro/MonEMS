import React from "react";

function ZonePredictions({ predictions }) {
  return (
    <div className="zone-predictions">
      <h2>Zone Predictions</h2>
      <ul>
        {Object.entries(predictions).map(([zone, value]) => (
          <li key={zone}>
            {zone}: {value.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ZonePredictions;
