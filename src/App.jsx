import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Import all our new components
import MetricCard from './components/MetricCard';
import LineChart from './components/LineChart';
import RssiGauge from './components/RssiGauge';
import InsightsPanel from './components/InsightsPanel';
import DataExporter from './components/DataExporter';
import './index.css';

// IMPORTANT: Replace this with your backend URL!
const API_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/data`;
//const API_URL = 'https://sm-poc-backend.onrender.com/data';

function App() {
  const [allData, setAllData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from the backend on mount and then poll every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setAllData(jsonData); // Store the full dataset
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setError("Failed to load data. Is the backend running?");
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Use useMemo to prevent re-calculations on every render
  const processedData = useMemo(() => {
    const recentData = allData.slice(0, 50).reverse(); // Get latest 50 points
    const latestReading = allData.length > 0 ? allData[0] : {};
    
    return {
      recentData,
      latestReading,
      labels: recentData.map(d => new Date(d.receivedAt).toLocaleTimeString()),
      voltageData: recentData.map(d => d.voltage),
      currentData: recentData.map(d => d.current),
      powerData: recentData.map(d => d.power),
      energyData: recentData.map(d => d.energy),
    };
  }, [allData]);

  return (
    <div className="dashboard-grid">
      <header className="header">
        <h1>⚡️ Smart Meter Analytics Dashboard</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <nav>
          <Link to="/analytics" style={{color: '#a0a0a0'}}>Go to AI Analytics Page →</Link>
        </nav>
      </header>

      <MetricCard 
        title="Real-time Voltage" 
        value={`${processedData.latestReading.voltage?.toFixed(1) || '...'} V`} 
        gridArea="metric-voltage"
      />
      <MetricCard 
        title="Real-time Current" 
        value={`${processedData.latestReading.current?.toFixed(2) || '...'} A`} 
        gridArea="metric-current"
      />
      <MetricCard 
        title="Real-time Power" 
        value={`${processedData.latestReading.power?.toFixed(0) || '...'} W`} 
        gridArea="metric-power"
      />
      <MetricCard 
        title="Total Energy" 
        value={`${processedData.latestReading.energy?.toFixed(2) || '...'} Wh`} 
        gridArea="metric-energy"
      />

      <LineChart 
        title="Voltage (V) - Last 50 Readings" 
        labels={processedData.labels} 
        data={processedData.voltageData} 
        borderColor="rgb(255, 99, 132)"
        gridArea="chart-voltage"
      />
      <LineChart 
        title="Current (A)" 
        labels={processedData.labels} 
        data={processedData.currentData} 
        borderColor="rgb(75, 192, 192)"
        gridArea="chart-current"
      />
      <LineChart 
        title="Power (W)" 
        labels={processedData.labels} 
        data={processedData.powerData} 
        borderColor="rgb(255, 205, 86)"
        gridArea="chart-power"
      />
      <LineChart 
        title="Cumulative Energy (Wh)" 
        labels={processedData.labels} 
        data={processedData.energyData} 
        borderColor="rgb(153, 102, 255)"
        gridArea="chart-energy"
      />

      <aside className="side-panel">
        <RssiGauge rssi={processedData.latestReading.rssi} />
        <InsightsPanel latestReading={processedData.latestReading} />
      </aside>

      <footer className="footer">
        <DataExporter allData={allData} />
      </footer>
    </div>
  );
}

export default App;