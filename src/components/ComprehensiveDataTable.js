import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Title } = Typography;

function ComprehensiveDataTable({ weatherData, dailyPredictions }) {
  const [averageCounts, setAverageCounts] = useState({});

  useEffect(() => {
    const fetchAverageCounts = async () => {
      const fetchForDate = async (date) => {
        const response = await fetch("https://api.i-a-i.io/averages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date }),
        });
        const data = await response.json();
        const totalAverageCount = data.reduce((acc, curr) => acc + curr.average_count, 0);
        console.log(`Fetched average count for ${date}: ${totalAverageCount}`);
        return totalAverageCount;
      };

      const averageCountsTemp = {};
      for (let day of weatherData) {
        const endTime = day.period.endTime;
        const date = convertDateFormat(endTime);
        averageCountsTemp[date] = await fetchForDate(date);
      }
      setAverageCounts(averageCountsTemp);
    };

    fetchAverageCounts();
  }, [weatherData]);

  const convertDateFormat = (endTime) => {
    const date = new Date(endTime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${month}/${day}`;
    console.log(`Converted date format for ${endTime}: ${formattedDate}`);
    return formattedDate;
  };

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
    const date = convertDateFormat(day.period.endTime);
    const averagePrediction = averageCounts[date] || 0;
    const percentageDifference =
      averagePrediction !== 0
        ? ((totalPrediction - averagePrediction) / averagePrediction) * 100
        : 0;

    console.log(`Data for ${day.period.name}:`);
    console.log(`  Total Prediction: ${totalPrediction}`);
    console.log(`  Average Prediction: ${averagePrediction}`);
    console.log(`  Percentage Difference: ${percentageDifference}`);

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
