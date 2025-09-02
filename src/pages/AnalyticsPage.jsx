import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnomalyChart from '../components/AnomalyChart.jsx';
import ForecastChart from '../components/ForecastChart.jsx';

// We will add the AI Summarizer component later
// import AiSummarizer from '../components/AiSummarizer.jsx';

const AnalyticsPage = () => {
    const [anomalyData, setAnomalyData] = useState({ anomalies: [], contextReadings: [] });
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("🤖 Generating AI summary...");

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [anomalyRes, forecastRes, summaryRes] = await Promise.all([
                    fetch('/api/anomalies'),
                    fetch('/api/forecast'),
                    fetch('/api/summary')
                ]);
                const anomalyJson = await anomalyRes.json();
                const forecastJson = await forecastRes.json();
                const summaryJson = await summaryRes.json();
                setSummary(summaryJson.summary);
                setAnomalyData(anomalyJson);
                setForecastData(forecastJson);
            } catch (err) {
                console.error("Failed to fetch analytics data:", err);
            }
            setLoading(false);
        };
        fetchAllData();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div className="analytics-container" style={{ padding: '2rem' }}>
            <header className="header" style={{ marginBottom: '2rem' }}>
                <h1>🤖 AI & Analytics Center</h1>
                <nav>
                    <Link to="/">← Back to Live Dashboard</Link>
                </nav>
            </header>

            {/* AI Summarizer will go here */}
            <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#2f2f4f' }}>
                <h3>Gemini AI Analysis</h3>
                {/* Use pre-wrap to respect newlines from the AI's response */}
                <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Anomaly Detection</h3>
                <p>Highlighting unusual power spikes in the last 24 hours.</p>
                <AnomalyChart anomalies={anomalyData.anomalies} contextReadings={anomalyData.contextReadings} />
            </div>
            
            <div className="card">
                <h3>Load Forecasting</h3>
                <p>Historical usage from the last 6 hours and predicted usage for the next 6 hours.</p>
                <ForecastChart forecast={forecastData.forecast} recentReadings={forecastData.recentReadings} />
            </div>
        </div>
    );
};

export default AnalyticsPage;