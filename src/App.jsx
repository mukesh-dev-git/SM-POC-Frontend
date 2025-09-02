import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './index.css';

// Register the components you need for the chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// IMPORTANT: Replace with your backend's URL.
// When running locally, it's http://localhost:3001
// When deployed, it will be your Render URL.
const API_URL = 'https://sm-poc-backend.onrender.com/data';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      // Reverse the array so the newest data is on the right of the chart
      setData(jsonData.reverse());
    } catch (e) {
      console.error("Failed to fetch data:", e);
      setError("Failed to load data. Is the backend running?");
    }
  };

  // useEffect hook to fetch data on component mount and set up polling
  useEffect(() => {
    fetchData(); // Fetch initial data
    const intervalId = setInterval(fetchData, 5000); // Poll for new data every 5 seconds
    
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const latestReading = data.length > 0 ? data[data.length - 1] : {};

  // Chart configuration
  const chartData = {
    labels: data.map(d => new Date(d.receivedAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Voltage (V)',
        data: data.map(d => d.voltage),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Power (W)',
        data: data.map(d => d.power),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Voltage (V)' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Power (W)' },
        grid: {
          drawOnChartArea: false, // only draw grid for the first Y axis
        },
      },
    },
  };

  return (
    <div className="App">
      <h1>⚡️ LoRa Smart Meter Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div className="dashboard">
        <MetricCard title="Voltage" value={`${latestReading.voltage?.toFixed(2) || 0} V`} />
        <MetricCard title="Current" value={`${latestReading.current?.toFixed(3) || 0} A`} />
        <MetricCard title="Power" value={`${latestReading.power?.toFixed(2) || 0} W`} />
        <MetricCard title="Energy" value={`${latestReading.energy?.toFixed(3) || 0} Wh`} />
        <MetricCard title="LoRa RSSI" value={`${latestReading.rssi || 0} dBm`} />
      </div>
      
      <div className="chart-container">
        <h2>Live Analytics</h2>
        {data.length > 0 ? <Line options={chartOptions} data={chartData} /> : <p>Waiting for data...</p>}
      </div>
    </div>
  );
}

// A simple component for the metric cards
const MetricCard = ({ title, value }) => (
  <div className="metric-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default App;