import React, { useMemo } from 'react';

const InsightsPanel = ({ latestReading }) => {
  const insights = useMemo(() => {
    const newInsights = [];
    if (!latestReading) return [];

    // Rule 1: Low Voltage
    if (latestReading.voltage < 215) {
      newInsights.push({ type: 'alert', message: `Low voltage detected: ${latestReading.voltage.toFixed(1)}V` });
    }

    // Rule 2: High Current (suggests major appliance use)
    if (latestReading.current > 10) {
      newInsights.push({ type: 'warning', message: `High current draw: ${latestReading.current.toFixed(2)}A` });
    }

    // Rule 3: Weak Signal
    if (latestReading.rssi < -85) {
        newInsights.push({ type: 'alert', message: `Weak LoRa Signal: ${latestReading.rssi}dBm` });
    }
    
    return newInsights;
  }, [latestReading]);

  return (
    <div className="card insights-panel">
      <h4>Automated Insights & Alerts</h4>
      {insights.length > 0 ? (
        <ul>
          {insights.map((insight, index) => (
            <li key={index} className={`insight-${insight.type}`}>
              {insight.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No immediate alerts or insights.</p>
      )}
    </div>
  );
};

export default InsightsPanel;