import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Papa from 'papaparse';

const DataExporter = ({ allData }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleExport = () => {
    // Filter data based on the selected date range
    const filteredData = allData.filter(d => {
      const recordDate = new Date(d.receivedAt);
      return recordDate >= startDate && recordDate <= endDate;
    });

    if (filteredData.length === 0) {
      alert("No data available for the selected date range.");
      return;
    }

    // Convert JSON to CSV
    const csv = Papa.unparse(filteredData);
    
    // Create a blob and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `smart_meter_export_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card data-exporter">
      <h3>Export Data for AI/ML</h3>
      <div className="date-pickers">
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
      </div>
      <button onClick={handleExport}>Export to CSV</button>
    </div>
  );
};

export default DataExporter;