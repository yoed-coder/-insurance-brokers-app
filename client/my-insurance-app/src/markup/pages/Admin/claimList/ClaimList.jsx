import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Container, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import claimService from '../../../../services/claim.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import './claim.css';

function ClaimList() {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingClaimId, setEditingClaimId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [expandedClaimId, setExpandedClaimId] = useState(null); // mobile expand

  const tableRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: 'Claims Report',
    copyStyles: true, // ✅ Ensures your CSS is copied to the print window
    pageStyle: `
      @page {
        size: auto;
        margin: 20mm;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        font-family: Arial, sans-serif;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 6px;
      }
    `,
  });
  

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await claimService.getAllClaims();
        setClaims(data || []);
        setFilteredClaims(data || []);
        setError('');
      } catch (err) {
        console.error('Error loading claims:', err);
        setError(err.message || 'Could not load claims');
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this claim?')) return;
    try {
      await claimService.deleteClaim(id);
      setClaims((prev) => prev.filter((c) => c.claim_id !== id));
      setFilteredClaims((prev) => prev.filter((c) => c.claim_id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete claim');
    }
  };

  const handleEditClick = (claim) => {
    setEditingClaimId(claim.claim_id);
    setEditFormData({ ...claim });
    setExpandedClaimId(claim.claim_id); // auto expand mobile card
  };

  const handleEditChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  const handleSaveEdit = async (id) => {
    try {
      await claimService.updateClaim(id, editFormData);
      setClaims((prev) => prev.map((c) => (c.claim_id === id ? { ...editFormData, claim_id: id } : c)));
      setFilteredClaims((prev) => prev.map((c) => (c.claim_id === id ? { ...editFormData, claim_id: id } : c)));
      setEditingClaimId(null);
    } catch (err) {
      console.error('Update error:', err);
      alert(err.message || 'Failed to update claim');
    }
  };

  const handleCancelEdit = () => {
    setEditingClaimId(null);
    setEditFormData({});
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    if (!value.trim()) {
      setFilteredClaims(claims);
    } else {
      const filtered = claims.filter((claim) =>
        `${claim.insured_name} ${claim.plate_number} ${claim.status_name}`
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredClaims(filtered);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredClaims(claims);
    setShowSuggestions(false);
  };

  const handleExportToExcel = () => {
    if (filteredClaims.length === 0) {
      alert('No claims available to export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredClaims.map((claim) => ({
        Insured: claim.insured_name,
        Plate: claim.plate_number,
        Status: claim.status_name,
        Date: claim.accident_date?.slice(0, 10) || 'N/A',
        Time: claim.accident_time || 'N/A',
        Place: claim.accident_place || 'N/A',
        'Subject Type': claim.subject_type_name || 'N/A',
        Detail: claim.subject_detail || 'N/A',
        Reason: claim.accident_reason || 'N/A',
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Claims');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'claims.xlsx');
  };

  if (loading) return (
    <div className="claims-background">
      <Container className="mt-4 text-center"><Spinner animation="border" /></Container>
    </div>
  );

  return (
    <div className="claims-background">
      <Container className="mt-4 claims-container">
        <div className="search-container">
          <InputGroup className="mbb">
            <Form.Control
              type="text"
              placeholder="Search claims..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="search-bar"
            />
            <Button variant="outline-secondary" onClick={handleClearSearch} id="clear">Clear</Button>
          </InputGroup>
        </div>
        {showSuggestions && searchQuery && filteredClaims.length > 0 && (
          <ul className="suggestions-list">
            {filteredClaims.slice(0, 5).map(claim => (
              <li key={claim.claim_id} onMouseDown={() => setFilteredClaims([claim])}>
                {claim.insured_name} | {claim.plate_number} | {claim.status_name}
              </li>
            ))}
          </ul>
        )}

        <div ref={tableRef} className="table-container">
          <h2 className="mb-4 text-center">Claim List <span>____</span></h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Desktop Table */}
          <div className="desktop-table">
            <Table striped bordered hover responsive variant="light" className="shadow-sm rounded text-center">
              <thead className="table-dark">
                <tr>
                  <th>Insured</th>
                  <th>Plate</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Place</th>
                  <th>Subject Type</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map(claim => (
                  <tr key={claim.claim_id}>
                    <td>
                      {editingClaimId === claim.claim_id ? (
                        <Form.Control size="sm" value={editFormData.insured_name} onChange={e => handleEditChange(e, 'insured_name')} />
                      ) : claim.insured_name}
                    </td>
                    <td>
                      {editingClaimId === claim.claim_id ? (
                        <Form.Control size="sm" value={editFormData.plate_number} onChange={e => handleEditChange(e, 'plate_number')} />
                      ) : claim.plate_number}
                    </td>
                    <td>
                      {editingClaimId === claim.claim_id ? (
                        <Form.Control size="sm" value={editFormData.status_name} onChange={e => handleEditChange(e, 'status_name')} />
                      ) : claim.status_name}
                    </td>
                    <td>
                      {editingClaimId === claim.claim_id ? (
                        <Form.Control size="sm" type="date" value={editFormData.accident_date?.slice(0,10) || ''} onChange={e => handleEditChange(e, 'accident_date')} />
                      ) : claim.accident_date?.slice(0,10)}
                    </td>
                    <td>
                      {editingClaimId === claim.claim_id ? (
                        <Form.Control size="sm" value={editFormData.accident_time} onChange={e => handleEditChange(e, 'accident_time')} />
                      ) : claim.accident_time}
                    </td>
                    <td>
                      {editingClaimId === claim.claim_id ? (
                        <Form.Control size="sm" value={editFormData.accident_place} onChange={e => handleEditChange(e, 'accident_place')} />
                      ) : claim.accident_place}
                    </td>
                    <td>
                      {editingClaimId === claim.claim_id ? (
                        <Form.Control size="sm" value={editFormData.subject_type_name} onChange={e => handleEditChange(e, 'subject_type_name')} />
                      ) : claim.subject_type_name}
                    </td>
                    <td>
                      {editingClaimId === claim.claim_id ? (
                        <Form.Control size="sm" value={editFormData.accident_reason} onChange={e => handleEditChange(e, 'accident_reason')} />
                      ) : claim.accident_reason}
                    </td>
                    <td>
                      {editingClaimId === claim.claim_id ? (
                        <>
                          <Button size="sm" variant="success" onClick={() => handleSaveEdit(claim.claim_id)}>Save</Button>{' '}
                          <Button size="sm" variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="primary" onClick={() => handleEditClick(claim)}>Edit</Button>{' '}
                          <Button size="sm" variant="danger" onClick={() => handleDelete(claim.claim_id)}>Delete</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-block">
            {filteredClaims.map(claim => (
              <div key={claim.claim_id} className="mobile-card">
                <div className="card-header" onClick={() => setExpandedClaimId(expandedClaimId === claim.claim_id ? null : claim.claim_id)}>
                  {editingClaimId === claim.claim_id ? (
                    <Form.Control size="sm" value={editFormData.insured_name} onChange={e => handleEditChange(e, 'insured_name')} />
                  ) : `${claim.insured_name} - ${claim.plate_number}`}
                </div>

                {expandedClaimId === claim.claim_id && (
                  <div className="card-body">
                    {editingClaimId === claim.claim_id ? (
                      <>
                        <Form.Control size="sm" className="mb-1" value={editFormData.status_name} onChange={e => handleEditChange(e, 'status_name')} placeholder="Status" />
                        <Form.Control size="sm" className="mb-1" type="date" value={editFormData.accident_date?.slice(0,10) || ''} onChange={e => handleEditChange(e, 'accident_date')} />
                        <Form.Control size="sm" className="mb-1" value={editFormData.accident_time} onChange={e => handleEditChange(e, 'accident_time')} />
                        <Form.Control size="sm" className="mb-1" value={editFormData.accident_place} onChange={e => handleEditChange(e, 'accident_place')} />
                        <Form.Control size="sm" className="mb-1" value={editFormData.subject_type_name} onChange={e => handleEditChange(e, 'subject_type_name')} />
                        <Form.Control size="sm" className="mb-1" value={editFormData.accident_reason} onChange={e => handleEditChange(e, 'accident_reason')} />
                        <div className="d-flex gap-2 mt-2">
                          <Button size="sm" variant="success" onClick={() => handleSaveEdit(claim.claim_id)}>Save</Button>
                          <Button size="sm" variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>Status:</strong> {claim.status_name}</p>
                        <p><strong>Date:</strong> {claim.accident_date?.slice(0,10)}</p>
                        <p><strong>Time:</strong> {claim.accident_time}</p>
                        <p><strong>Place:</strong> {claim.accident_place}</p>
                        <p><strong>Subject Type:</strong> {claim.subject_type_name}</p>
                        <p><strong>Reason:</strong> {claim.accident_reason}</p>
                        <div className="d-flex gap-2 mt-2">
                          <Button size="sm" variant="primary" onClick={() => handleEditClick(claim)}>Edit</Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(claim.claim_id)}>Delete</Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 d-flex gap-2 flex-wrap action-buttons">
          <Button variant="success" onClick={handleExportToExcel} className="imo">Export to Excel</Button>
          <Button variant="secondary" onClick={handlePrint} className="imo" id="prr">Print</Button>
        </div>
      </Container>
    </div>
  );
}

export default ClaimList;      