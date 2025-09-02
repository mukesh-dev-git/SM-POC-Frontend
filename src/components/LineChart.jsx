import React from 'react';
import { Line } from 'react-chartjs-2';

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { 
    y: { 
      beginAtZero: false,
      ticks: { color: 'rgba(255, 255, 255, 0.7)' }
    },
    x: { 
      ticks: { color: 'rgba(255, 255, 255, 0.7)' }
    }
  },
};

const LineChart = ({ title, data, labels, borderColor, gridArea }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        borderColor: borderColor || 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={`card chart-card ${gridArea}`}>
      <h3>{title}</h3>
      <div style={{ height: '250px' }}>
        <Line options={lineOptions} data={chartData} />
      </div>
    </div>
  );
};

export default LineChart;