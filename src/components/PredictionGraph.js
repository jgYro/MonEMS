import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PredictionGraph({ weatherData, dailyPredictions }) {
  const [averageCounts, setAverageCounts] = useState([]);

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
        return data.reduce((acc, curr) => acc + curr.average_count, 0);
      };

      const averageCountsTemp = [];
      for (let day of weatherData) {
        const endTime = day.period.endTime;
        const date = convertDateFormat(endTime);
        const averageCount = await fetchForDate(date);
        averageCountsTemp.push(averageCount);
      }
      setAverageCounts(averageCountsTemp);
    };

    fetchAverageCounts();
  }, [weatherData]);

  const convertDateFormat = (endTime) => {
    const date = new Date(endTime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const data = weatherData.map((day, index) => ({
    name: day.period.name.split(" ")[0], // Only take the first word of the period name
    prediction: dailyPredictions[index].total_prediction,
    average: averageCounts[index] || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="prediction"
          stroke="#EAAA00" // PMS 124 C
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="average"
          stroke="#002855" // PMS 295 C
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PredictionGraph;
