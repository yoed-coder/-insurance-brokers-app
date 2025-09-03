import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Form,
  Container,
  InputGroup,
  Spinner,
  Alert,
  Badge,
} from 'react-bootstrap';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import employeeService from '../../../../services/employee.service';
import "./employee.css";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const tableRef = useRef();

  // Fetch employees on load
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getAllEmployees();

        if (!data || (data.status && data.status !== 'success')) {
          setApiError(true);
          setApiErrorMessage(data?.message || 'Failed to fetch employees');
          return;
        }

        const employeesData = data.data || data;
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);
        setApiError(false);
      } catch (err) {
        setApiError(true);
        setApiErrorMessage(
          err.response?.data?.message ||
          err.message ||
          'Network error. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);

    if (!value.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter((emp) =>
        `${emp.employee_first_name} ${emp.employee_last_name}`.toLowerCase().includes(value.toLowerCase()) ||
        emp.employee_email?.toLowerCase().includes(value.toLowerCase()) ||
        emp.employee_phone?.includes(value)
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleSelectSuggestion = (fullName) => {
    setSearchQuery(fullName);
    setShowSuggestions(false);
    const selected = employees.find(
      (emp) =>
        `${emp.employee_first_name} ${emp.employee_last_name}`.toLowerCase() ===
        fullName.toLowerCase()
    );
    if (selected) {
      setFilteredEmployees([selected]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredEmployees(employees);
    setShowSuggestions(false);
  };

  const handleEditClick = (employee) => {
    setEditingEmployeeId(employee.employee_id);
    setEditFormData({ ...employee });
  };

  const handleEditChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  const handleSaveEdit = async (id) => {
    try {
      const updateData = {
        employee_email: editFormData.employee_email,
        active_employee: editFormData.active_employee,
        employee_first_name: editFormData.employee_first_name,
        employee_last_name: editFormData.employee_last_name,
        employee_phone: editFormData.employee_phone,
        company_role_id: editFormData.company_role_id,
      };

      await employeeService.updateEmployee(id, updateData);

      const updatedEmployees = employees.map((emp) =>
        emp.employee_id === id ? { ...emp, ...updateData } : emp
      );
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      setEditingEmployeeId(null);
      setEditFormData({});
      setSuccessMessage('Employee updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to update employee.');
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployeeId(null);
    setEditFormData({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await employeeService.deleteEmployee(id);
      const updated = employees.filter((emp) => emp.employee_id !== id);
      setEmployees(updated);
      setFilteredEmployees(updated);
      setSuccessMessage('Employee deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete employee.');
    }
  };

  const exportToExcel = () => {
    const exportData = filteredEmployees.map(({ employee_id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'employees.xlsx');
  };

  const handlePrint = useReactToPrint({ content: () => tableRef.current });

  if (loading) return (
    <div className="employee-loading">
      <Spinner animation="border" variant="primary" />
      <p>Loading employees...</p>
    </div>
  );

  if (apiError) return (
    <Container className="py-5 text-center">
      <Alert variant="danger">{apiErrorMessage}</Alert>
    </Container>
  );

  const suggestionList = employees
    .filter((emp) =>
      `${emp.employee_first_name} ${emp.employee_last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  return (
    <Container className="employee-list-container">
      <div className="employee-header">
        <h2 className="employee-title">
          <i className="fas fa-users"></i> Employee Management
        </h2>
        <div className="header-underline"></div>

        {/* Search */}
        <div className="search-container">
          <InputGroup className="search-group">
            <InputGroup.Text className="search-icon">
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="search-input"
            />
            <Button variant="outline-secondary" onClick={handleClearSearch} className="clear-btn">Clear</Button>
          </InputGroup>

          {showSuggestions && searchQuery && suggestionList.length > 0 && (
            <div className="suggestion-dropdown">
              {suggestionList.map((emp) => (
                <div
                  key={emp.employee_id}
                  className="suggestion-item"
                  onClick={() =>
                    handleSelectSuggestion(`${emp.employee_first_name} ${emp.employee_last_name}`)
                  }
                >
                  {emp.employee_first_name} {emp.employee_last_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {successMessage && <Alert variant="success" className="employee-alert">{successMessage}</Alert>}

      {/* Desktop Table */}
      <div className="table-container" ref={tableRef}>
        <div className="employee-table-responsive">
          <Table bordered hover className="employee-table">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Added Date</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-employees">
                    {searchQuery ? 'No employees match your search.' : 'No employees found.'}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, idx) => (
                  <tr key={emp.employee_id} className="employee-row">
                    <td>{idx + 1}</td>
                    <td>{editingEmployeeId === emp.employee_id ? <Form.Control value={editFormData.employee_first_name} onChange={e => handleEditChange(e, 'employee_first_name')} /> : emp.employee_first_name}</td>
                    <td>{editingEmployeeId === emp.employee_id ? <Form.Control value={editFormData.employee_last_name} onChange={e => handleEditChange(e, 'employee_last_name')} /> : emp.employee_last_name}</td>
                    <td>{editingEmployeeId === emp.employee_id ? <Form.Control value={editFormData.employee_email} onChange={e => handleEditChange(e, 'employee_email')} /> : emp.employee_email}</td>
                    <td>{editingEmployeeId === emp.employee_id ? <Form.Control value={editFormData.employee_phone} onChange={e => handleEditChange(e, 'employee_phone')} /> : emp.employee_phone}</td>
                    <td>{editingEmployeeId === emp.employee_id ? (
                      <Form.Select value={editFormData.active_employee} onChange={e => handleEditChange(e, 'active_employee')}>
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </Form.Select>
                    ) : (
                      <Badge bg={emp.active_employee ? 'success' : 'secondary'}>{emp.active_employee ? 'Active' : 'Inactive'}</Badge>
                    )}</td>
                    <td>{emp.added_date ? format(new Date(emp.added_date), 'MM-dd-yyyy | HH:mm') : 'N/A'}</td>
                    <td>{editingEmployeeId === emp.employee_id ? <Form.Control value={editFormData.company_role_name || ''} onChange={e => handleEditChange(e, 'company_role_name')} /> : emp.company_role_name}</td>
                    <td>
                      {editingEmployeeId === emp.employee_id ? (
                        <>
                          <Button size="sm" variant="success" onClick={() => handleSaveEdit(emp.employee_id)} className="me-2">Save</Button>
                          <Button size="sm" variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="primary" onClick={() => handleEditClick(emp)} className="me-2"><i className="fas fa-edit"></i></Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(emp.employee_id)}><i className="fas fa-trash"></i></Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="employee-cards">
        {filteredEmployees.map((emp, idx) => (
          <div key={emp.employee_id} className="employee-card">
            <div className="card-row"><strong>#</strong> {idx + 1}</div>
            {['employee_first_name','employee_last_name','employee_email','employee_phone'].map(field => (
              <div key={field} className="card-row">
                <strong>{field.replace('employee_', '').replace('_',' ').toUpperCase()}:</strong>{' '}
                {editingEmployeeId === emp.employee_id ? (
                  <input className="edit-input" value={editFormData[field]} onChange={e => handleEditChange(e, field)} />
                ) : emp[field]}
              </div>
            ))}
            <div className="card-row">
              <strong>Status:</strong>{' '}
              {editingEmployeeId === emp.employee_id ? (
                <select className="edit-input" value={editFormData.active_employee} onChange={e => handleEditChange(e, 'active_employee')}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              ) : (
                <Badge bg={emp.active_employee ? 'success' : 'secondary'}>{emp.active_employee ? 'Active' : 'Inactive'}</Badge>
              )}
            </div>
            <div className="card-row">
              <strong>Role:</strong>{' '}
              {editingEmployeeId === emp.employee_id ? (
                <input className="edit-input" value={editFormData.company_role_name || ''} onChange={e => handleEditChange(e, 'company_role_name')} />
              ) : emp.company_role_name}
            </div>
            <div className="card-actions">
              {editingEmployeeId === emp.employee_id ? (
                <>
                  <Button size="sm" className="action-btn save-btn" onClick={() => handleSaveEdit(emp.employee_id)}>Save</Button>
                  <Button size="sm" className="action-btn cancel-btn" onClick={handleCancelEdit}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button size="sm" className="action-btn edit-btn" onClick={() => handleEditClick(emp)}>Edit</Button>
                  <Button size="sm" className="action-btn delete-btn" onClick={() => handleDelete(emp.employee_id)}>Delete</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="table-controls">
        <Button onClick={exportToExcel} className="control-btn export-btn"><i className="fas fa-file-excel"></i> Export to Excel</Button>
        <Button onClick={handlePrint} className="control-btn print-btn"><i className="fas fa-print"></i> Print</Button>
      </div>
    </Container>
  );
}

export default EmployeeList;
