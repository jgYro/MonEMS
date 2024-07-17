// components/PredictionSummary.js
import React from "react";

function PredictionSummary({ predictions }) {
  const totalPrediction = predictions.total_prediction;
  const averagePrediction = 39.73;
  const percentageDifference =
    ((totalPrediction - averagePrediction) / averagePrediction) * 100;

  return (
    <div className="prediction-summary">
      <h2>Prediction Summary</h2>
      <p>Total Predicted Calls: {totalPrediction.toFixed(2)}</p>
      <p>
        Percentage Difference from Average: {percentageDifference.toFixed(2)}%
      </p>
    </div>
  );
}

export default PredictionSummary;
