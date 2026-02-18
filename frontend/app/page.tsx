"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    org_name: '', 
    submitter_name: '',
    submission_source: 'Website',
    issue_type: 'Hardware',
    description: '',
    contact_number: '', 
    email: ''          
  });
  
  const [message, setMessage] = useState('');
  // 1. NEW: State to store the Ticket Code
  const [ticketCode, setTicketCode] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/clients/')
      .then(response => {
        setCompanies(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, org_name: response.data[0].id }));
        }
      })
      .catch(error => console.error("Error fetching clients:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTicketCode(null); // Reset Code

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/create/', formData);
      setMessage(res.data.message);
      // 2. NEW: Capture the Ticket Code from the backend response
      setTicketCode(res.data.ticket_code); 
    } catch (error) {
      console.error(error);
      setMessage("Error submitting ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">New Support Ticket</h1>
        
        {message ? (
          <div className={`p-6 rounded-lg mb-4 text-center border ${message.includes('Error') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-800'}`}>
            
            {/* 3. NEW: Display the Ticket Code Big and Bold */}
            {ticketCode && (
              <div className="mb-4">
                <span className="block text-sm text-gray-500 uppercase tracking-wide">Ticket Generated Successfully</span>
                <span className="block text-4xl font-extrabold text-blue-600 mt-1">#{ticketCode}</span>
              </div>
            )}
            
            <p className="text-lg">{message}</p>
            
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <select 
                name="org_name" 
                value={formData.org_name} 
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submitter Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input 
                type="text" 
                name="submitter_name" 
                required
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Issue Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Issue Type</label>
              <select 
                name="issue_type" 
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                name="description" 
                required
                rows="3"
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>

            {/* Phone Number (Separate) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                type="text" 
                name="contact_number" 
                required
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Email Address (Separate) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {loading ? 'Processing...' : 'Submit Ticket'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}