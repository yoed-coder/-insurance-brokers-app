import React, { useState } from 'react';
import { useAuth } from '../../../../context/authContext';
import policyService from '../../../../services/policy.service';
import './policy.css';

function AddPolicy() {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    insured_name: '',
    insurer_name: '',
    policy_number: '',
    policy_type: '',
    expire_date: '',
    premium: '',
    commission: '',
  });

  const [plateNumbers, setPlateNumbers] = useState(['']);
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

  const handlePlateChange = (index, value) => {
    const updated = [...plateNumbers];
    updated[index] = value;
    setPlateNumbers(updated);
  };

  const addPlateField = () => {
    setPlateNumbers([...plateNumbers, '']);
  };

  const removePlateField = (index) => {
    const updated = plateNumbers.filter((_, i) => i !== index);
    setPlateNumbers(updated);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.insured_name.trim()) {
      newErrors.insured_name = 'Insured name is required';
    }
    
    if (!formData.insurer_name.trim()) {
      newErrors.insurer_name = 'Insurer name is required';
    }
    
    if (!formData.policy_number.trim()) {
      newErrors.policy_number = 'Policy number is required';
    }
    
    if (!formData.policy_type.trim()) {
      newErrors.policy_type = 'Policy type is required';
    }
    
    if (!formData.expire_date) {
      newErrors.expire_date = 'Expiry date is required';
    }
    
    if (!formData.premium || parseFloat(formData.premium) <= 0) {
      newErrors.premium = 'Valid premium amount is required';
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
      // Filter out empty plate numbers before submitting
      const nonEmptyPlates = plateNumbers.filter(plate => plate.trim() !== '');
      
      await policyService.createPolicy(
        { 
          ...formData, 
          // Only include plate_numbers if there are non-empty values
          ...(nonEmptyPlates.length > 0 && { plate_numbers: nonEmptyPlates })
        },
        token
      );
      
      setMessage('✅ Policy created successfully!');
      
      // Reset form
      setFormData({
        insured_name: '',
        insurer_name: '',
        policy_number: '',
        policy_type: '',
        expire_date: '',
        premium: '',
        commission: '',
      });
      setPlateNumbers(['']);
      setErrors({});
    } catch (error) {
      setMessage(`❌ Failed to create policy: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="policy-container">
      <div className="policy-card">
        <h1 className="policy-heading">
          Add a New Policy <span className="heading-underline"></span>
        </h1>

        <form onSubmit={handleSubmit} className="policy-form">
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
                className="policy-input"
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
                name="insurer_name"
                className="policy-input"
                value={formData.insurer_name}
                onChange={handleChange}
                id="insurer_name"
              />
              <label htmlFor="insurer_name" className="input-label">Insurer Name *</label>
              {errors.insurer_name && <div className="error-message">{errors.insurer_name}</div>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="policy_number"
                className="policy-input"
                value={formData.policy_number}
                onChange={handleChange}
                id="policy_number"
              />
              <label htmlFor="policy_number" className="input-label">Policy Number *</label>
              {errors.policy_number && <div className="error-message">{errors.policy_number}</div>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="policy_type"
                className="policy-input"
                value={formData.policy_type}
                onChange={handleChange}
                id="policy_type"
              />
              <label htmlFor="policy_type" className="input-label">Policy Type *</label>
              {errors.policy_type && <div className="error-message">{errors.policy_type}</div>}
            </div>

            <div className="input-group">
              <input
                type="date"
                name="expire_date"
                className="policy-input"
                value={formData.expire_date}
                onChange={handleChange}
                id="expire_date"
              />
              <label htmlFor="expire_date" className="input-label">Expiry Date *</label>
              {errors.expire_date && <div className="error-message">{errors.expire_date}</div>}
            </div>

            <div className="input-group">
              <input
                type="number"
                step="0.01"
                name="premium"
                className="policy-input"
                value={formData.premium}
                onChange={handleChange}
                id="premium"
              />
              <label htmlFor="premium" className="input-label">Premium Amount *</label>
              {errors.premium && <div className="error-message">{errors.premium}</div>}
            </div>

            <div className="input-group">
              <input
                type="number"
                step="0.01"
                name="commission"
                className="policy-input"
                value={formData.commission}
                onChange={handleChange}
                id="commission"
              />
              <label htmlFor="commission" className="input-label">Commission (Optional)</label>
            </div>
          </div>

          <div className="plate-section">
            <div className="section-header">
              <h3>Plate Numbers (Optional)</h3>
              <span className="optional-badge">Optional</span>
            </div>
            
            <div className="plate-list">
              {plateNumbers.map((plate, index) => (
                <div key={index} className="plate-input-group">
                  <input
                    type="text"
                    className="policy-input"
                    placeholder="Plate number (optional)"
                    value={plate}
                    onChange={(e) => handlePlateChange(index, e.target.value)}
                  />
                  {plateNumbers.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removePlateField(index)}
                      className="remove-plate-btn"
                      aria-label="Remove plate number"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={addPlateField}
              className="add-plate-btn"
            >
              + Add Another Plate
            </button>
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner"></span>
                Adding Policy...
              </>
            ) : (
              'Add Policy'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPolicy;