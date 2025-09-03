import React, { useState } from 'react';
import { useAuth } from '../../../../context/authContext';
import claimService from '../../../../services/claim.service';
import './claim.css';

function AddClaim() {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    insured_name: '',
    plate_number: '',
    accident_date: '',
    accident_time: '',
    accident_place: '',
    accident_reason: '',
    status_name: 'Open',
    subject_type_name: 'Vehicle',
    subject_detail: '',
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.insured_name.trim()) {
      newErrors.insured_name = 'Insured name is required';
    }
    
    if (!formData.accident_date) {
      newErrors.accident_date = 'Accident date is required';
    }
    
    if (!formData.accident_time) {
      newErrors.accident_time = 'Accident time is required';
    }
    
    if (!formData.accident_place.trim()) {
      newErrors.accident_place = 'Accident place is required';
    }
    
    if (!formData.accident_reason.trim()) {
      newErrors.accident_reason = 'Accident reason is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await claimService.addClaim(formData, token);
      setMessage('✅ Claim created successfully!');
      
      // Reset input fields after success
      setFormData({
        insured_name: '',
        plate_number: '',
        accident_date: '',
        accident_time: '',
        accident_place: '',
        accident_reason: '',
        status_name: 'Open',
        subject_type_name: 'Vehicle',
        subject_detail: '',
      });
    } catch (error) {
      setMessage(`❌ Failed to create claim: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="claim-container">
      <div className="claim-card">
        <h1 className="claim-heading">
          Add a New Claim <span className="heading-underline"></span>
        </h1>

        <form onSubmit={handleSubmit} className="claim-form">
          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-grid">
            <div className="input-group">
              <input
                type="text"
                name="insured_name"
                className="claim-input"
                value={formData.insured_name}
                onChange={handleChange}
                id="insured_name"
              />
              <label htmlFor="insured_name" className="input-label">Insured Name *</label>
              {errors.insured_name && <div className="error-message">{errors.insured_name}</div>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="plate_number"
                className="claim-input"
                value={formData.plate_number}
                onChange={handleChange}
                id="plate_number"
              />
              <label htmlFor="plate_number" className="input-label">Plate Number (Optional)</label>
            </div>

            <div className="input-group">
              <input
                type="date"
                name="accident_date"
                className="claim-input"
                value={formData.accident_date}
                onChange={handleChange}
                id="accident_date"
              />
              <label htmlFor="accident_date" className="input-label">Accident Date *</label>
              {errors.accident_date && <div className="error-message">{errors.accident_date}</div>}
            </div>

            <div className="input-group">
              <input
                type="time"
                name="accident_time"
                className="claim-input"
                value={formData.accident_time}
                onChange={handleChange}
                id="accident_time"
              />
              <label htmlFor="accident_time" className="input-label">Accident Time *</label>
              {errors.accident_time && <div className="error-message">{errors.accident_time}</div>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="accident_place"
                className="claim-input"
                value={formData.accident_place}
                onChange={handleChange}
                id="accident_place"
              />
              <label htmlFor="accident_place" className="input-label">Accident Place *</label>
              {errors.accident_place && <div className="error-message">{errors.accident_place}</div>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="accident_reason"
                className="claim-input"
                value={formData.accident_reason}
                onChange={handleChange}
                id="accident_reason"
              />
              <label htmlFor="accident_reason" className="input-label">Accident Reason *</label>
              {errors.accident_reason && <div className="error-message">{errors.accident_reason}</div>}
            </div>

            <div className="input-group">
              <select
                name="status_name"
                className="claim-select"
                value={formData.status_name}
                onChange={handleChange}
                id="status_name"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected</option>
              </select>
              <label htmlFor="status_name" className="select-label">Status</label>
            </div>

            <div className="input-group">
              <select
                name="subject_type_name"
                className="claim-select"
                value={formData.subject_type_name}
                onChange={handleChange}
                id="subject_type_name"
              >
                <option value="Vehicle">Vehicle</option>
                <option value="Property">Property</option>
                <option value="Personal Injury">Personal Injury</option>
                <option value="Other">Other</option>
              </select>
              <label htmlFor="subject_type_name" className="select-label">Subject Type</label>
            </div>

            <div className="input-group full-width">
              <textarea
                name="subject_detail"
                className="claim-textarea"
                value={formData.subject_detail}
                onChange={handleChange}
                id="subject_detail"
                rows="3"
                placeholder=" "
              />
              <label htmlFor="subject_detail" className="input-label">Subject Details (Optional)</label>
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner"></span>
                Adding Claim...
              </>
            ) : (
              'Add Claim'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddClaim;