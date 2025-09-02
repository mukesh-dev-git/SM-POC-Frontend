import React from 'react';
import { Line } from 'react-chartjs-2';

const AnomalyChart = ({ anomalies, contextReadings }) => {
    const chartData = {
        labels: contextReadings.map(d => new Date(d.receivedAt).toLocaleTimeString()),
        datasets: [{
            type: 'line',
            label: 'Power (W)',
            data: contextReadings.map(d => d.power),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.1)',
            fill: true,
        }, {
            type: 'scatter',
            label: 'Anomalies',
            data: anomalies.map(anomaly => ({
                x: new Date(anomaly.timestamp).toLocaleTimeString(),
                y: anomaly.power
            })),
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            radius: 8,
            hoverRadius: 12,
        }]
    };
    // ... options for the chart
    return <Line data={chartData} /* options={options} */ />;
};

export default AnomalyChart;