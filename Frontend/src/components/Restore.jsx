import { useState } from 'react';
import axios from 'axios';

export default function BackupRestore() {
  // State to hold the selected backup file
  const [selectedFile, setSelectedFile] = useState(null);
  // Message to display success or error info
  const [message, setMessage] = useState('');
  // Timestamp returned after successful restore
  const [timestamp, setTimestamp] = useState('');
  // Indicates if restore operation is in progress
  const [loading, setLoading] = useState(false);
  // Controls display of confirmation modal
  const [showModal, setShowModal] = useState(false);

  // Handle file selection from file input
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Triggered when "Upload & Restore" button is clicked
  const confirmRestore = () => {
    if (!selectedFile) {
      // Ensure a file is selected before proceeding
      setMessage('Please select a backup file first.');
      setTimestamp('');
      return;
    }
    // Show confirmation modal
    setShowModal(true);
  };

  // Handles the actual restore logic after confirmation
  const handleRestore = async () => {
    // Close modal and reset state
    setShowModal(false);
    setLoading(true);
    setMessage('');
    setTimestamp('');

    // Prepare form data with the selected backup file
    const formData = new FormData();
    formData.append('backup_file', selectedFile);

    try {
      // Send POST request to restore endpoint
      const response = await axios.post('http://localhost:8000/api/restore/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Display success message and timestamp
      setMessage(response.data.detail);
      setTimestamp(response.data.timestamp || '');
    } catch (error) {
      // Display error message if restore fails
      setMessage(error.response?.data?.detail || 'Restore failed.');
      setTimestamp('');
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Restore Backup</h3>

      {/* File input for selecting .tar.gz backup file */}
      <input
        type="file"
        onChange={handleFileChange}
        accept=".tar.gz"
        disabled={loading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {/* Restore button triggers modal confirmation */}
      <button
        onClick={confirmRestore}
        disabled={loading}
        className={`w-full text-white font-bold py-2 px-4 rounded ${
          loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Restoring...' : 'Upload & Restore'}
      </button>

      {/* Display restore result message and timestamp */}
      {message && (
        <div className="text-sm text-gray-700">
          <p>{message}</p>
          {timestamp && <p className="text-gray-500">Timestamp: {timestamp}</p>}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Confirm Restore</h4>
            <p className="text-sm text-gray-600">
              Are you sure you want to restore this backup? This action will overwrite existing data.
            </p>
            <div className="flex justify-end space-x-2 pt-4">
              {/* Cancel button to dismiss modal */}
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              {/* Confirm button triggers restore */}
              <button
                onClick={handleRestore}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
