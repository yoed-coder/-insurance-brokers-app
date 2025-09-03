import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Container, InputGroup, Spinner, Alert, Modal, Card, Collapse } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import policyService from '../../../../services/policy.service';
import vehicleService from '../../../../services/vehicle.service';
import ImportPolicies from './ImportPolicies';
import './list.css';

function PolicyList() {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showPlateModal, setShowPlateModal] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [plateText, setPlateText] = useState('');
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [expandedPolicyId, setExpandedPolicyId] = useState(null);
  const [showPolicyPlates, setShowPolicyPlates] = useState(null);

  const tableRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await policyService.getAllPolicies();
      const data = Array.isArray(res) ? res : res.data || [];
      setPolicies(data);
      setFilteredPolicies(data);
    } catch (err) {
      console.error('❌ Error fetching policies:', err);
      setError('Failed to load policies.');
      setPolicies([]);
      setFilteredPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredPolicies(policies);
    } else {
      const filtered = policies.filter(
        (p) =>
          p.insured_name?.toLowerCase().includes(term.toLowerCase()) ||
          p.policy_number?.toLowerCase().includes(term.toLowerCase()) ||
          p.insurer_name?.toLowerCase().includes(term.toLowerCase()) ||
          p.policy_type?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredPolicies(filtered);
    }
  };

  const handleEditClick = (policy) => {
    setEditingPolicyId(policy.policy_id);
    setEditFormData({ ...policy });
  };

  const handleEditChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  const handleSaveEdit = async (id) => {
    try {
      const formattedData = { ...editFormData };
      if (formattedData.expire_date) {
        formattedData.expire_date = formattedData.expire_date.split('T')[0];
      }
      await policyService.updatePolicy(id, formattedData);
      const updatedPolicies = policies.map((p) =>
        p.policy_id === id ? { ...p, ...formattedData } : p
      );
      setPolicies(updatedPolicies);
      setFilteredPolicies(updatedPolicies);
      setEditingPolicyId(null);
    } catch (err) {
      console.error('Update error:', err);
      alert(err.message || 'Failed to update policy');
    }
  };

  const handleCancelEdit = () => {
    setEditingPolicyId(null);
    setEditFormData({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) return;
    try {
      await policyService.deletePolicy(id);
      const updated = policies.filter((p) => p.policy_id !== id);
      setPolicies(updated);
      setFilteredPolicies(updated);
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete policy');
    }
  };

  const exportToExcel = () => {
    const exportData = filteredPolicies.map(({ policy_id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Policies');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'policies.xlsx');
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const openPlateModal = (policyId) => {
    setSelectedPolicyId(policyId);
    setPlateText('');
    setShowPlateModal(true);
  };

  const savePlates = async () => {
    const plateNumbers = plateText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (!plateNumbers.length) {
      alert('Enter at least one plate number.');
      return;
    }

    try {
      await vehicleService.addPlatesForPolicy(selectedPolicyId, plateNumbers);
      setShowPlateModal(false);
      fetchPolicies();
    } catch (err) {
      console.error(err);
      alert('Failed to add plates.');
    }
  };

  const togglePlateDropdown = (policyId, e) => {
    if (e) e.stopPropagation();
    if (expandedPolicyId === policyId) {
      setExpandedPolicyId(null);
    } else {
      setExpandedPolicyId(policyId);
    }
  };

  const handlePolicyNumberClick = (policyId, e) => {
    if (mobileView) {
      e.stopPropagation();
      if (showPolicyPlates === policyId) {
        setShowPolicyPlates(null);
      } else {
        setShowPolicyPlates(policyId);
      }
    }
  };

  if (loading) return (
    <div className="policy-loading">
      <Spinner animation="border" variant="primary" />
      <p>Loading policies...</p>
    </div>
  );

  return (
    <Container className="policy-list-container">
      <div className="policy-header">
        <h2 className="policy-title">
          <i className="fas fa-file-contract"></i> Policy Management
        </h2>
        <div className="header-underline"></div>
        
        <div className="search-container">
          <InputGroup className="search-group">
            <InputGroup.Text className="search-icon">
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <Button
              variant="outline-secondary"
              onClick={() => {
                setSearchTerm('');
                setFilteredPolicies(policies);
              }}
              className="clear-btn"
            >
              Clear
            </Button>
          </InputGroup>
        </div>
      </div>

      {error && <Alert variant="danger" className="policy-alert">{error}</Alert>}

      {mobileView ? (
        // Mobile Card View
        <div className="mobile-policy-cards">
          {filteredPolicies.length === 0 ? (
            <div className="no-policies-card">
              <i className="fas fa-search"></i>
              <p>{searchTerm ? 'No policies match your search.' : 'No policies found.'}</p>
            </div>
          ) : (
            filteredPolicies.map((policy, idx) => (
              <Card key={policy.policy_id} className="policy-card-mobile">
                <Card.Body>
                  <div className="policy-card-header">
                    <div className="policy-index-mobile">#{idx + 1}</div>
                    <div className="policy-actions-mobile">
                      {editingPolicyId === policy.policy_id ? (
                        <div className="edit-actions-mobile">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleSaveEdit(policy.policy_id)}
                            className="action-btn-mobile save-btn"
                          >
                            <i className="fas fa-check"></i>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={handleCancelEdit}
                            className="action-btn-mobile cancel-btn"
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        </div>
                      ) : (
                        <div className="default-actions-mobile">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleEditClick(policy)}
                            className="action-btn-mobile edit-btn"
                            title="Edit policy"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => openPlateModal(policy.policy_id)}
                            className="action-btn-mobile plate-btn"
                            title="Add plates"
                          >
                            <i className="fas fa-car"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(policy.policy_id)}
                            className="action-btn-mobile delete-btn"
                            title="Delete policy"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="policy-details-mobile">
                    <div className="policy-field">
                      <label>Insured Name:</label>
                      {editingPolicyId === policy.policy_id ? (
                        <Form.Control
                          value={editFormData.insured_name || ''}
                          onChange={(e) => handleEditChange(e, 'insured_name')}
                          size="sm"
                          className="edit-input-mobile"
                        />
                      ) : (
                        <span>{policy.insured_name}</span>
                      )}
                    </div>

                    <div className="policy-field">
                      <label>Policy Number:</label>
                      {editingPolicyId === policy.policy_id ? (
                        <Form.Control
                          value={editFormData.policy_number || ''}
                          onChange={(e) => handleEditChange(e, 'policy_number')}
                          size="sm"
                          className="edit-input-mobile"
                        />
                      ) : (
                        <span 
                          className="policy-number-clickable"
                          onClick={(e) => handlePolicyNumberClick(policy.policy_id, e)}
                        >
                          {policy.policy_number}
                          <i className="fas fa-info-circle policy-info-icon"></i>
                        </span>
                      )}
                    </div>

                    {/* Policy Plates Dropdown (shown when policy number is clicked) */}
                    <Collapse in={showPolicyPlates === policy.policy_id}>
                      <div className="policy-plates-dropdown">
                        <div className="plates-header">
                          <h6>Plate Numbers</h6>
                        </div>
                        <div className="plates-content">
                          {policy.plates && Array.isArray(policy.plates) && policy.plates.length > 0 ? (
                            <div className="plates-list-mobile">
                              {policy.plates.map((plate, idx) => (
                                <span key={idx} className="plate-badge-mobile">{plate}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="no-plates-mobile">No plates assigned</span>
                          )}
                        </div>
                      </div>
                    </Collapse>

                    <div className="policy-field">
                      <label>Policy Type:</label>
                      {editingPolicyId === policy.policy_id ? (
                        <Form.Control
                          value={editFormData.policy_type || ''}
                          onChange={(e) => handleEditChange(e, 'policy_type')}
                          size="sm"
                          className="edit-input-mobile"
                        />
                      ) : (
                        <span>{policy.policy_type}</span>
                      )}
                    </div>

                    <div className="policy-field">
                      <label>Expire Date:</label>
                      {editingPolicyId === policy.policy_id ? (
                        <Form.Control
                          type="date"
                          value={editFormData.expire_date?.split('T')[0] || ''}
                          onChange={(e) => handleEditChange(e, 'expire_date')}
                          size="sm"
                          className="edit-input-mobile"
                        />
                      ) : (
                        <span>{policy.expire_date?.split('T')[0]}</span>
                      )}
                    </div>

                    <div className="policy-field">
                      <label>Insurer:</label>
                      {editingPolicyId === policy.policy_id ? (
                        <Form.Control
                          value={editFormData.insurer_name || ''}
                          onChange={(e) => handleEditChange(e, 'insurer_name')}
                          size="sm"
                          className="edit-input-mobile"
                        />
                      ) : (
                        <span>{policy.insurer_name}</span>
                      )}
                    </div>

                    <div className="policy-field">
                      <label>Premium:</label>
                      {editingPolicyId === policy.policy_id ? (
                        <Form.Control
                          type="number"
                          value={editFormData.premium || ''}
                          onChange={(e) => handleEditChange(e, 'premium')}
                          size="sm"
                          className="edit-input-mobile"
                        />
                      ) : (
                        <span>${policy.premium}</span>
                      )}
                    </div>

                    {/* Plate Numbers Dropdown - Only show when expanded */}
                    <div className="policy-field">
                      <div 
                        className="plate-dropdown-header"
                        onClick={(e) => togglePlateDropdown(policy.policy_id, e)}
                      >
                        <label>Add/View Plate Numbers:</label>
                        <i className={`fas fa-chevron-${expandedPolicyId === policy.policy_id ? 'up' : 'down'}`}></i>
                      </div>
                      <Collapse in={expandedPolicyId === policy.policy_id}>
                        <div className="plate-dropdown-content">
                          {policy.plates && Array.isArray(policy.plates) && policy.plates.length > 0 ? (
                            <div className="plates-list-mobile">
                              {policy.plates.map((plate, idx) => (
                                <span key={idx} className="plate-badge-mobile">{plate}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="no-plates-mobile">No plates assigned</span>
                          )}
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openPlateModal(policy.policy_id)}
                            className="mt-2"
                          >
                            <i className="fas fa-plus"></i> Add More Plates
                          </Button>
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      ) : (
        // Desktop Table View
        <div className="table-container">
          <div ref={tableRef} className="policy-table-responsive">
            <Table bordered hover className="policy-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Insured</th>
                  <th>Policy No</th>
                  <th className="desktop-only">Type</th>
                  <th className="desktop-only expire-date-column">Expire Date</th>
                  <th className="desktop-only">Insurer</th>
                  <th className="desktop-only">Premium</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-policies">
                      {searchTerm ? 'No policies match your search.' : 'No policies found.'}
                    </td>
                  </tr>
                ) : (
                  filteredPolicies.map((policy, idx) => (
                    <tr key={policy.policy_id} className="policy-row">
                      <td className="policy-index">{idx + 1}</td>

                      {/* Insured Name */}
                      <td className="policy-insured">
                        {editingPolicyId === policy.policy_id ? (
                          <Form.Control
                            value={editFormData.insured_name || ''}
                            onChange={(e) => handleEditChange(e, 'insured_name')}
                            size="sm"
                            className="edit-input"
                          />
                        ) : (
                          <span>{policy.insured_name}</span>
                        )}
                      </td>

                      {/* Policy Number with Plate Hover */}
                      <td className="policy-number">
                        {editingPolicyId === policy.policy_id ? (
                          <Form.Control
                            value={editFormData.policy_number || ''}
                            onChange={(e) => handleEditChange(e, 'policy_number')}
                            size="sm"
                            className="edit-input"
                          />
                        ) : (
                          <div className="hover-trigger">
                            <span>{policy.policy_number}</span>
                            <div className="hover-card policy-card">
                              <div className="card-header">
                                <h6>Plate Numbers</h6>
                              </div>
                              <div className="card-body">
                                {policy.plates && Array.isArray(policy.plates) && policy.plates.length > 0 ? (
                                  <div className="plates-list">
                                    {policy.plates.map((plate, idx) => (
                                      <span key={idx} className="plate-badge">{plate}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="no-plates">No plates assigned</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Other Editable Fields */}
                      <td className="desktop-only policy-type">
                        {editingPolicyId === policy.policy_id ? (
                          <Form.Control
                            value={editFormData.policy_type || ''}
                            onChange={(e) => handleEditChange(e, 'policy_type')}
                            size="sm"
                            className="edit-input"
                          />
                        ) : (
                          policy.policy_type
                        )}
                      </td>
                      
                      <td className="desktop-only policy-expiry expire-date-column">
                        {editingPolicyId === policy.policy_id ? (
                          <Form.Control
                            type="date"
                            value={editFormData.expire_date?.split('T')[0] || ''}
                            onChange={(e) => handleEditChange(e, 'expire_date')}
                            size="sm"
                            className="edit-input"
                          />
                        ) : (
                          policy.expire_date?.split('T')[0]
                        )}
                      </td>
                      
                      <td className="desktop-only policy-insurer">
                        {editingPolicyId === policy.policy_id ? (
                          <Form.Control
                            value={editFormData.insurer_name || ''}
                            onChange={(e) => handleEditChange(e, 'insurer_name')}
                            size="sm"
                            className="edit-input"
                          />
                        ) : (
                          policy.insurer_name
                        )}
                      </td>
                      
                      <td className="desktop-only policy-premium">
                        {editingPolicyId === policy.policy_id ? (
                          <Form.Control
                            type="number"
                            value={editFormData.premium || ''}
                            onChange={(e) => handleEditChange(e, 'premium')}
                            size="sm"
                            className="edit-input"
                          />
                        ) : (
                          `$${policy.premium}`
                        )}
                      </td>

                      <td className="policy-actions">
                        {editingPolicyId === policy.policy_id ? (
                          <div className="edit-actions">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleSaveEdit(policy.policy_id)}
                              className="action-btn save-btn"
                            >
                              <i className="fas fa-check"></i> Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={handleCancelEdit}
                              className="action-btn cancel-btn"
                            >
                              <i className="fas fa-times"></i> Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="default-actions">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleEditClick(policy)}
                              className="action-btn edit-btn"
                              title="Edit policy"
                            >
                              <i className="fas fa-edit"></i> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => openPlateModal(policy.policy_id)}
                              className="action-btn plate-btn"
                              title="Add plates"
                            >
                              <i className="fas fa-car"></i> Plates
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(policy.policy_id)}
                              className="action-btn delete-btn"
                              title="Delete policy"
                            >
                              <i className="fas fa-trash"></i> Delete
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      <div className="table-controls">
        <Button onClick={exportToExcel} className="control-btn export-btn">
          <i className="fas fa-file-excel"></i> Export to Excel
        </Button>
        <Button onClick={handlePrint} className="control-btn print-btn">
          <i className="fas fa-print"></i> Print
        </Button>
        <ImportPolicies onImportComplete={fetchPolicies} />
      </div>

      {/* Plate Modal for adding plates */}
      <Modal show={showPlateModal} onHide={() => setShowPlateModal(false)} centered className="plate-modal">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title><i className="fas fa-car"></i> Add Plate Numbers</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form.Group>
            <Form.Label>Enter plate numbers (one per line)</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={plateText}
              onChange={(e) => setPlateText(e.target.value)}
              placeholder={`ABC123\nXYZ456`}
              className="plate-textarea"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="secondary" onClick={() => setShowPlateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={savePlates}>
            Save Plates
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PolicyList;                