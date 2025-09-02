import React from 'react';
import { Line } from 'react-chartjs-2';

const ForecastChart = ({ forecast, recentReadings }) => {
    if (!forecast || !recentReadings) return <p>Loading forecast data...</p>;

    const allLabels = [
        ...recentReadings.map(d => new Date(d.receivedAt).toLocaleTimeString()),
        ...forecast.forecast.timestamps.map(ts => new Date(ts).toLocaleTimeString())
    ];

    const historicalData = recentReadings.map(d => d.power);
    // Add nulls to create a gap between historical and forecasted data
    const forecastData = [
        ...Array(historicalData.length - 1).fill(null),
        historicalData[historicalData.length - 1], // Last historical point
        ...forecast.forecast.power_watts
    ];

    const chartData = {
        labels: allLabels,
        datasets: [{
            label: 'Historical Power (W)',
            data: historicalData,
            borderColor: 'rgb(53, 162, 235)',
            tension: 0.2,
        }, {
            label: 'Forecasted Power (W)',
            data: forecastData,
            borderColor: 'rgb(75, 192, 192)',
            borderDash: [5, 5], // Dashed line for forecast
            tension: 0.2,
        }]
    };
    // ... options for the chart
    return <Line data={chartData} /* options={options} */ />;
};

export default ForecastChart;