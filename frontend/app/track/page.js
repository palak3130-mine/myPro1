"use client";
import { useState } from 'react';
import axios from 'axios';

export default function TrackTicket() {
  const [ticketCode, setTicketCode] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTicketData(null);

    try {
      // Searching by the new Random Code
      const res = await axios.get(`http://127.0.0.1:8000/api/status/${ticketCode.trim()}/`);
      setTicketData(res.data);
    } catch (err) {
      setError("Ticket not found. Please check the Code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-800">Track Your Ticket</h1>
        <p className="text-center text-gray-500 mb-8">Enter your unique Ticket Code to see live status</p>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="Enter Ticket Code (e.g., A7X29B)" 
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest font-bold uppercase"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4 bg-red-50 p-3 rounded">{error}</p>}

        {/* FULL DETAILS DISPLAY */}
        {ticketData && (
          <div className="border-t pt-6 animate-fade-in">
            
            {/* Header: Status & Code */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Ticket Code</span>
                <span className="block text-2xl font-bold text-gray-800">#{ticketData.ticket_code}</span>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm
                ${ticketData.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 
                  ticketData.status === 'Assigned' ? 'bg-blue-100 text-blue-800' : 
                  ticketData.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-200 text-gray-800'}`}>
                {ticketData.status}
              </div>
            </div>

            {/* Grid for Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Organization</label>
                  <p className="font-medium text-gray-900">{ticketData.org_name_display}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Submitter Name</label>
                  <p className="font-medium text-gray-900">{ticketData.submitter_name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Contact Info</label>
                  <p className="text-sm text-gray-900">{ticketData.contact_number}</p>
                  <p className="text-sm text-gray-600">{ticketData.email}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Issue Type</label>
                  <p className="font-medium text-gray-900">{ticketData.issue_type}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Submitted On</label>
                  <p className="text-sm text-gray-900">{new Date(ticketData.created_at).toLocaleString()}</p>
                </div>
                 {/* Assigned To Section */}
                 <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase">Assigned Agent</label>
                    {ticketData.assigned_member_display ? (
                      <p className="font-bold text-blue-700">{ticketData.assigned_member_display}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Pending Assignment...</p>
                    )}
                </div>
              </div>
            </div>

            {/* Description Section (Full Width) */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-gray-400 uppercase">Issue Description</label>
              <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg text-gray-700 leading-relaxed shadow-sm">
                {ticketData.description}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}