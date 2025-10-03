// components/DocumentModal.js
"use client";

export default function DocumentModal({ visible, document, onClose }) {
  if (!visible || !document) return null;

  // Helper to convert Firestore timestamps to readable date
  const formatValue = (value) => {
    if (!value) return "-";
    // Check if it's a Firestore timestamp
    if (value?.seconds) {
      return new Date(value.seconds * 1000).toLocaleString();
    }
    // For regular Date objects
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return value.toString();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg max-h-[80vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold hover:bg-gray-300"
        >
          ✕
        </button>

        {/* Modal Header */}
        <h2 className="text-xl font-bold mb-4">Document Details</h2>

        {/* Document Content */}
        <div className="space-y-2">
          {Object.entries(document).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b py-1">
              <span className="font-semibold">{key}</span>
              <span>{formatValue(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
