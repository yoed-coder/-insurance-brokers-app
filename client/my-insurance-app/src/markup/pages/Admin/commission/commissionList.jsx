import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Container, Form, Button, Card } from "react-bootstrap";
import commissionService from "../../../../services/commission.service";
import "./com.css";

function CommissionList() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await commissionService.getCommissionStatus(token);
      setCommissions(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch commission status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (policyId, isPaid) => {
    try {
      await commissionService.updateCommissionStatus(
        policyId,
        isPaid ? "Paid" : "Unpaid",
        token
      );
      setCommissions((prev) =>
        prev.map((c) =>
          c.policy_id === policyId
            ? { ...c, commission_status: isPaid ? "Paid" : "Unpaid" }
            : c
        )
      );
    } catch (err) {
      alert("Error updating commission status");
    }
  };

  const handleEdit = (commission) => {
    setEditRow(commission.policy_id);
    setEditData({ ...commission });
  };

  const handleCancel = () => {
    setEditRow(null);
    setEditData({});
  };

  const handleSave = async (policyId) => {
    try {
      await commissionService.updateCommissionDetails(policyId, editData, token);
      setCommissions((prev) =>
        prev.map((c) => (c.policy_id === policyId ? { ...editData } : c))
      );
      setEditRow(null);
      setEditData({});
    } catch (err) {
      alert("Error saving changes");
    }
  };

  const handleInputChange = (e, field) => {
    setEditData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="commission-page-wrapper">
      <Container className="commission-container">
        <h3 className="commission-title">
          💰 Commission Payments <span className="title-underline">___</span>
        </h3>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {loading ? (
          <div className="commission-loading">
            <Spinner animation="border" variant="primary" />
            <p>Loading commission data...</p>
          </div>
        ) : commissions.length === 0 ? (
          <Alert variant="info">No policies found.</Alert>
        ) : (
          <div className="commission-table-container">
            <div className="commission-table-responsive">
              <Table bordered hover className="commission-table">
                <thead>
                  <tr>
                    <th className="table-header">Insured Name</th>
                    <th className="table-header">Insurer Name</th>
                    <th className="table-header">Policy #</th>
                    <th className="table-header">Premium</th>
                    <th className="table-header">Total Commission</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.policy_id} className="commission-row">
                      <td data-label="Insured Name">
                        {editRow === c.policy_id ? (
                          <Form.Control
                            value={editData.insured_name || ""}
                            onChange={(e) => handleInputChange(e, "insured_name")}
                          />
                        ) : (
                          c.insured_name
                        )}
                      </td>
                      <td data-label="Insurer Name">
                        {editRow === c.policy_id ? (
                          <Form.Control
                            value={editData.insurer_name || ""}
                            onChange={(e) => handleInputChange(e, "insurer_name")}
                          />
                        ) : (
                          c.insurer_name
                        )}
                      </td>
                      <td data-label="Policy #">
                        {editRow === c.policy_id ? (
                          <Form.Control
                            value={editData.policy_number || ""}
                            onChange={(e) => handleInputChange(e, "policy_number")}
                          />
                        ) : (
                          c.policy_number
                        )}
                      </td>
                      <td data-label="Premium">
                        {editRow === c.policy_id ? (
                          <Form.Control
                            type="number"
                            value={editData.premium || ""}
                            onChange={(e) => handleInputChange(e, "premium")}
                          />
                        ) : (
                          `$${c.premium}`
                        )}
                      </td>
                      <td data-label="Total Commission">
                        {editRow === c.policy_id ? (
                          <Form.Control
                            type="number"
                            value={editData.total_commission || ""}
                            onChange={(e) => handleInputChange(e, "total_commission")}
                          />
                        ) : (
                          `$${c.total_commission}`
                        )}
                      </td>
                      <td data-label="Status">
                        <Form.Check
                          type="checkbox"
                          checked={c.commission_status === "Paid"}
                          onChange={(e) =>
                            handleStatusChange(c.policy_id, e.target.checked)
                          }
                          label={c.commission_status === "Paid" ? "Paid" : "Unpaid"}
                        />
                      </td>
                      <td data-label="Actions">
                        {editRow === c.policy_id ? (
                          <div className="edit-actions">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleSave(c.policy_id)}
                              className="me-2 action-btn"
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={handleCancel}
                              className="action-btn"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEdit(c)}
                            className="mf-2 action-btn"
                          >
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default CommissionList;