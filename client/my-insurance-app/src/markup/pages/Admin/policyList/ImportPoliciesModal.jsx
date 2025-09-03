// src/components/policy/importPolicies/ImportPoliciesModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ImportPolicies from './ImportPolicies';

export default function ImportPoliciesModal({ show, handleClose, onImportComplete }) {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Import Policies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ImportPolicies onImportComplete={onImportComplete} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
