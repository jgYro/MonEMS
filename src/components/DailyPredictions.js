// components/DailyPredictions.js
import React from "react";
import "./DailyPredictions.css"; // We'll create this CSS file next

function DailyPredictions({ dailyPredictions, weatherData }) {
  const averagePrediction = 39.73;

  return (
    <div className="daily-predictions">
      <h2>Daily Predictions</h2>
      <table className="predictions-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Temperature</th>
            <th>Total Predicted Calls</th>
            <th>Difference from Average</th>
            <th>Zone Predictions</th>
          </tr>
        </thead>
        <tbody>
          {dailyPredictions.map((prediction, index) => {
            const day = weatherData[index];
            const totalPrediction = prediction.total_prediction;
            const percentageDifference =
              ((totalPrediction - averagePrediction) / averagePrediction) * 100;

            return (
              <tr key={index}>
                <td>{day.period.name}</td>
                <td>
                  {day.period.temperature}°{day.period.temperatureUnit}
                </td>
                <td>{totalPrediction.toFixed(2)}</td>
                <td
                  className={
                    percentageDifference >= 0 ? "positive" : "negative"
                  }
                >
                  {percentageDifference.toFixed(2)}%
                </td>
                <td>
                  <table className="zone-predictions-table">
                    <tbody>
                      {Object.entries(prediction.predictions).map(
                        ([zone, value]) => (
                          <tr key={zone}>
                            <td>{zone}</td>
                            <td>{value.toFixed(2)}</td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DailyPredictions;
