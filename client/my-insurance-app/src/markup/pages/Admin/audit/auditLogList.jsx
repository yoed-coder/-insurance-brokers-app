import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';
import api from '../../../../services/api';
import './audit.css';

function AuditLogList() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/audits')
            .then(res => setLogs(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Container className="audit-container">
            <div className="loading-spinner">
                <Spinner animation="border" />
            </div>
        </Container>
    );
    
    if (error) return (
        <Container className="audit-container">
            <Alert variant="danger" className="error-alert">
                {error}
            </Alert>
        </Container>
    );

    return (
        <Container className="audit-container">
            <h3 className="audit-header">Audit Logs</h3>
            <div className="table-container">
                <Table striped bordered hover responsive className="audit-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Employee</th>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>Entity ID</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={log.id}>
                                <td data-label="Timestamp">{new Date(log.timestamp).toLocaleString()}</td>
                                <td data-label="Employee">{log.employee_name || 'System'}</td>
                                <td data-label="Action">{log.action}</td>
                                <td data-label="Entity">{log.entity}</td>
                                <td data-label="Entity ID">{log.entity_id}</td>
                                <td data-label="Description">{log.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}
export default AuditLogList;