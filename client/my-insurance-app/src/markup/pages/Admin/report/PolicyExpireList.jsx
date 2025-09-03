import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Spinner, Alert, Container } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { format, differenceInDays } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../../../../services/api";
import { useAuth } from "../../../../context/authContext";
import './expiring.css';

function PolicyExpireList() {
  const { token } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const response = await api.get("/policies/expiring", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Raw response from /policies/expiring:", response);

        // Safely extract array of policies
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        }

        const formattedData = data.map((p) => ({
          ...p,
          days_remaining: differenceInDays(new Date(p.expire_date), new Date()),
        }));

        setPolicies(formattedData);
        setError(""); // clear any previous error
      } catch (err) {
        console.error("Error fetching policies:", err);
        setError("Failed to load expiring policies");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [token]);

  const exportToExcel = () => {
    if (!policies.length) return alert("No data to export.");
    const ws = XLSX.utils.json_to_sheet(policies);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expiring Policies");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "expiring_policies.xlsx");
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Expiring Policies Report",
    onPrintError: (err) => console.error("Print error:", err),
  });

  return (
    <Container className="mt-4">
      <h3 className="h3">📅 Policies Expiring in the Next 30 Days <span className="span">____</span></h3>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {policies.length > 0 && (
        <div ref={printRef} style={{ background: "#fff", padding: "10px" }}>
          {/* Desktop Table */}
          <div className="desktop-table">
            <Table striped bordered hover responsive className='expire'>
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Policy Number</th>
                  <th>Insured Name</th>
                  <th>Policy Type</th>
                  <th>Expire Date</th>
                  <th>Days Remaining</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy, index) => (
                  <tr key={policy.policy_id}>
                    <td>{index + 1}</td>
                    <td>{policy.policy_number}</td>
                    <td>{policy.insured_name}</td>
                    <td>{policy.policy_type}</td>
                    <td>{format(new Date(policy.expire_date), "yyyy-MM-dd")}</td>
                    <td>{policy.days_remaining}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Mobile Vertical Cards */}
          <div className="mobile-block">
            {policies.map((policy, index) => (
              <div key={policy.policy_id} className="mobile-card">
                <p><span className="label">No</span><span className="value">{index + 1}</span></p>
                <p><span className="label">Policy Number</span><span className="value">{policy.policy_number}</span></p>
                <p><span className="label">Insured Name</span><span className="value">{policy.insured_name}</span></p>
                <p><span className="label">Policy Type</span><span className="value">{policy.policy_type}</span></p>
                <p><span className="label">Expire Date</span><span className="value">{format(new Date(policy.expire_date), "yyyy-MM-dd")}</span></p>
                <p><span className="label">Days Remaining</span><span className="value">{policy.days_remaining}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-3">
        <Button variant="success" className="imo" onClick={exportToExcel}>Export to Excel</Button>
        <Button variant="primary" onClick={handlePrint} disabled={!policies.length} className='imo'>Print</Button>
      </div>
    </Container>
  );
}

export default PolicyExpireList;
