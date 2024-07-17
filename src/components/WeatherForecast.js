// components/WeatherForecast.js
import React from "react";

function WeatherForecast({ forecast }) {
  if (!Array.isArray(forecast) || forecast.length === 0) {
    return <p>No forecast data available</p>;
  }

  return (
    <div className="weather-forecast">
      <h2>Weather Forecast for Morgantown</h2>
      {forecast.map((item, index) => (
        <div key={index} className="forecast-period">
          <h3>{item.period.name}</h3>
          <p>
            Temperature: {item.period.temperature}°{item.period.temperatureUnit}
          </p>
          <p>
            Wind: {item.period.windSpeed} {item.period.windDirection}
          </p>
          <p>Forecast: {item.period.shortForecast}</p>
          <p>{item.period.detailedForecast}</p>
          {item.period.probabilityOfPrecipitation.value && (
            <p>
              Precipitation Chance:{" "}
              {item.period.probabilityOfPrecipitation.value}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default WeatherForecast;
