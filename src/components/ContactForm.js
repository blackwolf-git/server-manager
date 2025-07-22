import React, { useState } from 'react';
import { createContactRequest } from '../api/api';

const ContactForm = ({ services }) => {
  const [formData, setFormData] = useState({
    service_id: '',
    purpose: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createContactRequest(formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting request');
    }
  };

  return (
    <div>
      <h2>Contact Request</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Service:</label>
          <select 
            value={formData.service_id}
            onChange={(e) => setFormData({...formData, service_id: e.target.value})}
            required
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} (${service.price})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Purpose:</label>
          <textarea
            value={formData.purpose}
            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            required
          />
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default ContactForm;
