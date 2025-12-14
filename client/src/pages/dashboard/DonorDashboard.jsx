import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DonorDashboard = () => {
  const [available, setAvailable] = useState(false);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodRequests, setBloodRequests] = useState([]);
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/donor/dashboard', { headers });
      setAvailable(res.data.available);
      setDonationHistory(res.data.donation_history || []);
    } catch (err) {
      console.error('Failed to load donor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/donor/requests', { headers });
      setBloodRequests(res.data);
      console.log('Fetched blood requests:', res.data); // Debug log
    } catch (err) {
      console.error('Failed to load blood requests:', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchRequests();
  }, []);

  const toggleAvailability = async () => {
    try {
      const res = await axios.patch('/api/donor/availability', {}, { headers });
      setAvailable(res.data.available);
    } catch (err) {
      console.error('Failed to update availability:', err);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axios.patch(`/api/blood/accept/${id}`, {}, { headers });
      alert('Request accepted successfully.');
      fetchRequests();
      fetchDashboard();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const completeDonation = async (id) => {
    try {
      await axios.patch(`/api/donor/complete/${id}`, {}, { headers });
      alert('Marked as completed.');
      fetchRequests();
      fetchDashboard();
    } catch (err) {
      console.error('Failed to complete donation:', err);
    }
  };

  return (
    <div className="container">
      <h2 className="heading mt-[30px]">Blood Donor Dashboard</h2>

      {loading ? (
        <p className="text_para mt-5">Loading...</p>
      ) : (
        <>
          {/* Toggle Availability */}
          <div className="my-6">
            <h3 className="font-semibold text-lg mb-2">Availability</h3>
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded font-semibold ${
                available ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'
              }`}
            >
              {available ? 'Active - Available to Donate' : 'Inactive - Not Available'}
            </button>
          </div>

          {/* Incoming Blood Requests */}
          <div className="my-6">
            <h3 className="font-semibold text-lg mb-2">Incoming Blood Requests</h3>
            {bloodRequests.length === 0 ? (
              <p>No requests at this time.</p>
            ) : (
              <ul className="space-y-3">
                {bloodRequests.map((req) => {
                  console.log('Rendering request:', req); // Debug log
                  return (
                    <li key={req._id} className="border p-4 rounded shadow">
                      {/* Conditional rendering */}
                      {req.status === 'accepted' && String(req.donor_id) === String(req.current_user_id) ? (
                        <>
                          <p><strong>Name:</strong> {req.patient_id?.name}</p>
                          <p><strong>Phone:</strong> {req.patient_id?.phone}</p>
                        </>
                      ) : (
                        <>
                          <p><strong>Location:</strong> {req.location}</p>
                          <p><strong>Blood Type:</strong> {req.blood_type}</p>
                        </>
                      )}

                      <p><strong>Status:</strong> {req.status}</p>

                      {req.status === 'requested' && (
                        <button
                          onClick={() => acceptRequest(req._id)}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Accept Request
                        </button>
                      )}

                      {req.status === 'accepted' && String(req.donor_id) === String(req.current_user_id) && (
                        <button
                          onClick={() => completeDonation(req._id)}
                          className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Donation History */}
          <div className="my-6">
            <h3 className="font-semibold text-lg mb-2">Donation History</h3>
            {donationHistory.length === 0 ? (
              <p>No donation records yet.</p>
            ) : (
              <ul className="list-disc pl-5">
                {donationHistory.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DonorDashboard;
