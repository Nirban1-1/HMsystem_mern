import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [pickupLocation, setPickupLocation] = useState('');
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [bloodType, setBloodType] = useState('');
  const [donorLocation, setDonorLocation] = useState('');
  const [matchedDonors, setMatchedDonors] = useState([]);
  const [requestMessage, setRequestMessage] = useState('');
  const [bloodRequests, setBloodRequests] = useState([]);

  useEffect(() => {
    axios.get('/api/appointment/doctor/specialties', { headers }).then(res => setSpecialties(res.data));
    axios.get('/api/ambulance/my-requests', { headers }).then(res => setAmbulanceRequests(res.data));
    axios.get('/api/appointment/my', { headers }).then(res => setAppointments(res.data));
  }, []);

  useEffect(() => {
    axios.get('/api/blood/mine', { headers }).then(res => {
      setBloodRequests(res.data);
    });
  }, []);

  const fetchDoctors = async () => {
    const res = await axios.get(`/api/appointment/doctor/by-specialty/${selectedSpecialty}`, { headers });
    setDoctors(res.data);
  };

  const fetchDoctorSlots = async (doctorId) => {
    const res = await axios.get(`/api/appointment/doctor/${doctorId}/slots`, { headers });
    setAvailableSlots(res.data);
    setSelectedDoctor(doctorId);
  };

  const bookAppointment = async (slot) => {
    await axios.post('/api/appointment/book', {
      doctor_id: selectedDoctor,
      date: slot.date,
      time: slot.time
    }, { headers });

    alert('Appointment booked successfully.');
    setAvailableSlots([]);
    setDoctors([]);
    setSelectedSpecialty('');
    const updated = await axios.get('/api/appointment/my', { headers });
    setAppointments(updated.data);
  };

  const requestAmbulance = async () => {
    await axios.post('/api/ambulance/request', { pickup_location: pickupLocation }, { headers });
    alert('Ambulance requested.');
  };

  const requestBlood = async () => {
    try {
      const res = await axios.post('/api/blood/request', {
        blood_type: bloodType,
        location: donorLocation
      }, { headers });
      alert('Blood request sent successfully.');
      setMatchedDonors([]);
      const updated = await axios.get('/api/blood/mine', { headers });
      setBloodRequests(updated.data);
    } catch (err) {
      console.error('Failed to request blood:', err);
      setRequestMessage('Failed to send blood request.');
    }
  };

  return (
    <div className="container space-y-10 mt-10">
      {/* Book Appointment */}
      <section>
        <h2 className="text-xl font-bold mb-3">Book a Doctor Appointment</h2>
        <select onChange={(e) => setSelectedSpecialty(e.target.value)} className="border px-3 py-2">
          <option value="">Select a Specialty</option>
          {specialties.map((spec, i) => (
            <option key={i} value={spec}>{spec}</option>
          ))}
        </select>
        <button onClick={fetchDoctors} className="ml-3 bg-blue-600 text-white px-4 py-2 rounded">Find Doctors</button>

        {doctors.length > 0 && (
          <div className="mt-5 space-y-3">
            {doctors.map((doc) => (
              <div key={doc._id} className="border p-3">
                <p><strong>{doc.name}</strong> - {doc.specialization}</p>
                <button onClick={() => fetchDoctorSlots(doc._id)} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">View Slots</button>
              </div>
            ))}
          </div>
        )}

        {availableSlots.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold">Available Slots:</h4>
            {availableSlots.map((slot, idx) => (
              <button key={idx} onClick={() => bookAppointment(slot)} className="block my-2 px-4 py-2 border rounded hover:bg-gray-100">
                {slot.date} @ {slot.time}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Appointments */}
      {appointments.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">Your Appointments</h2>
          <ul className="space-y-4">
            {appointments.map((appt) => (
              <li key={appt.id} className="border p-4 rounded shadow-sm">
                <p><strong>Doctor:</strong> {appt.doctor_name}</p>
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.time}</p>
                <p><strong>Status:</strong> {appt.status}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Ambulance */}
      <section>
        <h2 className="text-xl font-bold mb-3">Request an Ambulance</h2>
        <input type="text" placeholder="Pickup Location" className="border px-3 py-2 w-full"
          value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
        <button onClick={requestAmbulance} className="mt-2 bg-red-600 text-white px-4 py-2 rounded">Request Ambulance</button>
      </section>

      {ambulanceRequests.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">Your Ambulance Requests</h2>
          <ul className="space-y-2">
            {ambulanceRequests.map((req) => (
              <li key={req._id} className="border p-3 rounded shadow-sm">
                <p><strong>Status:</strong> {req.status}</p>
                <p><strong>Pickup:</strong> {req.pickup_location}</p>
                <p className="text-sm text-gray-500">Requested at: {new Date(req.requested_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-3">Request for Blood</h2>
        <input type="text" placeholder="Blood Type (e.g. A+)" className="border px-3 py-2 mr-3"
          value={bloodType} onChange={(e) => setBloodType(e.target.value)} />
        <input type="text" placeholder="Location" className="border px-3 py-2 mr-3"
          value={donorLocation} onChange={(e) => setDonorLocation(e.target.value)} />
        <button onClick={requestBlood} className="bg-purple-600 text-white px-4 py-2 rounded">
          Send Blood Request
        </button>
        {requestMessage && <p className="text-green-600 mt-3">{requestMessage}</p>}
      </section>

      {/* Blood Request Status */}
      {bloodRequests.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">Your Blood Requests</h2>
          <ul className="space-y-3">
            {bloodRequests.map((req) => (
              <li key={req._id} className="border p-4 rounded shadow">
                <p><strong>Status:</strong> {req.status}</p>
                <p><strong>Blood Type:</strong> {req.blood_type}</p>
                <p><strong>Location:</strong> {req.location}</p>
                <p><strong>Requested At:</strong> {new Date(req.requested_at).toLocaleString()}</p>
                {req.accepted_at && (
                  <p><strong>Accepted At:</strong> {new Date(req.accepted_at).toLocaleString()}</p>
                )}
                {req.donor && (
                  <>
                    <p><strong>Donor Name:</strong> {req.donor.name}</p>
                    <p><strong>Donor Phone:</strong> {req.donor.phone}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default PatientDashboard;
