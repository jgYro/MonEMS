// App.js
import React, { useState, useEffect, useCallback } from "react";
import { Layout, Spin, Alert, Card, Row, Col } from "antd";
import ComprehensiveDataTable from "./components/ComprehensiveDataTable";
import PredictionGraph from "./components/PredictionGraph";
import "antd/dist/reset.css";

const { Header, Content } = Layout;

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [dailyPredictions, setDailyPredictions] = useState(null);
  const [error, setError] = useState(null);

  const fetchPredictions = useCallback(async (features) => {
    try {
      console.log("Fetching predictions with features:", features);
      // const response = await fetch("/predict", {
      const response = await fetch("https://52.90.41.192/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temp: features.TEMP,
          wdsp: features.WDSP,
          mxspd: features.MXSPD,
          prcp: features.PRCP,
          frshtt: features.FRSHTT,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Predictions data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setError("Failed to fetch predictions. Please try again later.");
    }
  }, []);

  const fetchWeatherData = useCallback(async () => {
    try {
      console.log("Fetching weather data...");
      // const response = await fetch("/forecast", {
      const response = await fetch("https://52.90.41.192/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: "Morgantown",
          lat: "39.630252",
          long: "-79.938288",
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Weather data:", JSON.stringify(data, null, 2));

      if (
        data &&
        data.data &&
        data.data.Morgantown &&
        Array.isArray(data.data.Morgantown) &&
        data.data.Morgantown.length > 0
      ) {
        setWeatherData(data.data.Morgantown);

        // Fetch predictions for each day
        const dailyPredictionsData = await Promise.all(
          data.data.Morgantown.map((day) => fetchPredictions(day.features)),
        );
        setDailyPredictions(dailyPredictionsData);
      } else {
        console.error("Unexpected data structure:", data);
        throw new Error("Weather data is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data. Please try again later.");
    }
  }, [fetchPredictions]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const renderDashboard = () => (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Card title="Today's Weather" style={{ height: "100%" }}>
          {weatherData && (
            <>
              <p>
                Temperature: {weatherData[0].period.temperature}°
                {weatherData[0].period.temperatureUnit}
              </p>
              <p>
                Wind: {weatherData[0].period.windSpeed}{" "}
                {weatherData[0].period.windDirection}
              </p>
              <p>Forecast: {weatherData[0].period.shortForecast}</p>
            </>
          )}
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Today's Prediction" style={{ height: "100%" }}>
          {dailyPredictions && (
            <>
              <p>
                Total Predicted Calls:{" "}
                {dailyPredictions[0].total_prediction.toFixed(2)}
              </p>
              <p>
                Highest Zone Prediction:{" "}
                {
                  Object.entries(dailyPredictions[0].predictions).reduce(
                    (a, b) => (a[1] > b[1] ? a : b),
                  )[0]
                }
              </p>
            </>
          )}
        </Card>
      </Col>
      <Col span={8}>
        <Card title="EMS Call Prediction Trend" style={{ height: "100%" }}>
          <PredictionGraph
            weatherData={weatherData}
            dailyPredictions={dailyPredictions}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="Weather and Prediction Table">
          <ComprehensiveDataTable
            weatherData={weatherData}
            dailyPredictions={dailyPredictions}
          />
        </Card>
      </Col>
    </Row>
  );

  return (
    <Layout className="layout">
      <Header>
        <h1 style={{ color: "white", margin: 0 }}>
          Weather and Prediction Dashboard
        </h1>
      </Header>
      <Content style={{ padding: "16px" }}>
        {error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : weatherData && dailyPredictions ? (
          renderDashboard()
        ) : (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Spin size="large" />
            <p>Loading data...</p>
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default App;
