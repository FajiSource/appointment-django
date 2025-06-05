import React, { useState } from 'react';

export default function LogTable({ logs }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="bg-white w-full max-w-5xl max-h-[85vh] rounded-md shadow-lg flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-300 px-5 py-3">
            <h2 className="text-lg font-semibold">Audit Logs</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-600 hover:text-red-600 text-xl font-semibold leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          {/* Table container */}
          <div className="overflow-auto max-h-[70vh]">
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 sticky top-0 z-10">
                  {['Date', 'Action', 'Actor', 'Affected Record'].map((header) => (
                    <th
                      key={header}
                      className="border border-gray-300 px-3 py-2 text-left font-medium"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-300 hover:bg-gray-50"
                  >
                    <td className="border border-gray-300 px-3 py-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{log.action}</td>
                    <td className="border border-gray-300 px-3 py-2">{log.actor}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {log.object
                        ? `${log.object.model} #${log.object.id} - ${log.object.representation}`
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-300 px-5 py-3 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
