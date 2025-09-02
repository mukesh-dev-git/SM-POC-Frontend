import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const RSSI_MIN = -120; // Worst signal
const RSSI_MAX = -30;  // Best signal
const RSSI_RANGE = RSSI_MAX - RSSI_MIN;

// Function to get color based on RSSI value
const getColor = (rssi) => {
  if (rssi > -65) return '#4CAF50'; // Green (Excellent)
  if (rssi > -80) return '#FFC107'; // Amber (Good)
  return '#F44336'; // Red (Weak)
};

const RssiGauge = ({ rssi }) => {
  // Clamp the RSSI value within our expected range for visualization
  const clampedRssi = Math.max(RSSI_MIN, Math.min(rssi, RSSI_MAX));
  const normalizedRssi = ((clampedRssi - RSSI_MIN) / RSSI_RANGE) * 100;
  const color = getColor(rssi);

  const data = {
    datasets: [
      {
        data: [normalizedRssi, 100 - normalizedRssi],
        backgroundColor: [color, '#3e3e3e'],
        borderColor: ['#242424', '#242424'],
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
  };

  return (
    <div className="card gauge-container">
      <h4>LoRa Signal Strength (RSSI)</h4>
      <div style={{ height: '120px' }}>
         <Doughnut data={data} options={options} />
      </div>
      <div className="gauge-label">{rssi || '...'} dBm</div>
    </div>
  );
};

export default RssiGauge;