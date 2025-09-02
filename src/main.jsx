import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import './index.css';

// --- START: CHART.JS REGISTRATION ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController, // <-- For the anomaly scatter plot
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,            // <-- For filling the area under the line
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController, // <-- Register the scatter controller
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler             // <-- Register the filler plugin
);
// --- END: CHART.JS REGISTRATION ---


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);