import React, { useState } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import policyService from '../../../../services/policy.service';

function ImportPolicies({ onImportComplete }) {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const safeValue = (val) => {
    if (val === undefined || val === null) return null;
    if (typeof val === 'string' && val.trim() === '') return null;
    return val;
  };

  const convertDateFormat = (value) => {
    if (!value) return null;
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      if (date) {
        const yyyy = date.y;
        const mm = String(date.m).padStart(2, '0');
        const dd = String(date.d).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
    }
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return null;
  };

  const parseNumber = (value) => {
    if (!value) return null;
    // Handle "value + value" format from Excel
    const parts = String(value).split('+');
    let total = 0;
    for (const part of parts) {
      // Remove commas, currency symbols, spaces
      const cleaned = part.replace(/[^0-9.-]+/g, '');
      const num = parseFloat(cleaned);
      if (!isNaN(num)) total += num;
    }
    return total || null;
  };

  const getCellValue = (row, keys) => {
    for (const key of keys) {
      const value = row[key];
      if (value !== undefined && value !== '') return value;
    }
    return null;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setMessage('');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      console.log(`📄 Found ${rows.length} data rows in file`);

      let successCount = 0;

      for (const [index, row] of rows.entries()) {
        const policy = {
          policy_number: safeValue(getCellValue(row, ["Policy Number", "POLICY NO", "POLICY NUMBER"])),
          insured_name: safeValue(getCellValue(row, ["Insured Name", "INSURED NAME", "INSURED PERSON (COMPANY)"])),
          policy_type: safeValue(getCellValue(row, ["Policy Type", "INTEREST INSURED", "TYPE"])),
          insurer_name: safeValue(getCellValue(row, ["Insurer Name", "INSURER NAME", "INSURER COMPANY"])),
          expire_date: safeValue(convertDateFormat(
            row["Expire Date"] || row["EXPIRY DATE"] || ""
          )),
          premium: safeValue(parseNumber(
            getCellValue(row, ["Premium", "PREMIUM AMOUNT"])
          )),
          commission: safeValue(parseNumber(
            getCellValue(row, ["Commission", "COMMISSION AMOUNT"])
          ))
        };

        console.log(`📌 Row ${index + 1}:`, policy);

        try {
          await policyService.createPolicy(policy);
          successCount++;
        } catch (err) {
          console.error(`❌ Failed to import row ${index + 1}:`,
            Object.values(row),
            err?.response?.data?.message || err.message
          );
        }
      }

      if (successCount > 0) {
        setMessage(`✅ ${successCount} policies imported successfully.`);
        onImportComplete?.();
      } else {
        setMessage('⚠️ No valid policies were imported. Check the data.');
      }
    } catch (error) {
      console.error('❌ Error reading file:', error);
      setMessage('❌ Error importing policies. Please check the console.');
    }

    setImporting(false);
  };

  return (
    <div>
      <h5>📥 Import Policies from Excel</h5>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {importing && <Spinner animation="border" size="sm" className="ms-2" />}
      {message && (
        <Alert variant={message.startsWith('✅') ? 'success' : 'warning'} className="mt-3">
          {message}
        </Alert>
      )}
    </div>
  );
}

export default ImportPolicies;
