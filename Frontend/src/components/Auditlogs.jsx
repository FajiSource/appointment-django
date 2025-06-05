import { useState, useEffect } from 'react';
import axios from 'axios';
import LogTable from './LogTable'; 

export default function AuditLogs() {
  // State variables to store audit logs, loading state, and any error
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to trigger data fetching when component mounts
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Function to fetch audit logs from the backend API
  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auditlogs/');
      setLogs(response.data); // Store logs in state
    } catch (err) {
      setError('Error fetching audit logs'); // Set error if request fails
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Display error message if data fetching failed
  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  // Render the LogTable component once logs are successfully fetched
  return <LogTable logs={logs} />;
}
