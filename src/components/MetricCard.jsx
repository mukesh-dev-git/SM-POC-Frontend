import React from 'react';

const MetricCard = ({ title, value, gridArea }) => (
  <div className={`card metric-card ${gridArea}`}>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default MetricCard;