// components/ComprehensiveDataTable.js
import React from "react";
import { Table, Typography, Tag, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Title } = Typography;

function ComprehensiveDataTable({ weatherData, dailyPredictions }) {
  const averagePrediction = 39.73;

  const columns = [
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      width: 100,
    },
    {
      title: "Temperature",
      dataIndex: "temperature",
      key: "temperature",
      width: 120,
    },
    {
      title: "Wind",
      dataIndex: "wind",
      key: "wind",
      width: 120,
    },
    {
      title: "Forecast",
      dataIndex: "forecast",
      key: "forecast",
      width: 200,
      render: (text) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Total Predicted Calls",
      dataIndex: "totalPrediction",
      key: "totalPrediction",
      width: 150,
    },
    {
      title: "Difference from Average",
      dataIndex: "difference",
      key: "difference",
      width: 180,
      render: (text, record) => (
        <span>
          {record.difference >= 0 ? (
            <ArrowUpOutlined style={{ color: "green" }} />
          ) : (
            <ArrowDownOutlined style={{ color: "red" }} />
          )}{" "}
          {Math.abs(record.difference).toFixed(2)}%
        </span>
      ),
    },
    {
      title: "Zone Predictions",
      dataIndex: "zonePredictions",
      key: "zonePredictions",
      width: 300,
      render: (zonePredictions) => (
        <Row gutter={[8, 8]}>
          {Object.entries(zonePredictions).map(([zone, value]) => (
            <Col span={8} key={zone}>
              <Tag
                color="blue"
                style={{
                  width: "100%",
                  textAlign: "center",
                  whiteSpace: "normal",
                  height: "auto",
                }}
              >
                {zone}: {value.toFixed(2)}
              </Tag>
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  const data = weatherData.map((day, index) => {
    const prediction = dailyPredictions[index];
    const totalPrediction = prediction.total_prediction;
    const percentageDifference =
      ((totalPrediction - averagePrediction) / averagePrediction) * 100;

    return {
      key: index,
      day: day.period.name,
      temperature: `${day.period.temperature}°${day.period.temperatureUnit}`,
      wind: `${day.period.windSpeed} ${day.period.windDirection}`,
      forecast: day.period.shortForecast,
      totalPrediction: totalPrediction.toFixed(2),
      difference: percentageDifference,
      zonePredictions: prediction.predictions,
    };
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 3 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default ComprehensiveDataTable;
