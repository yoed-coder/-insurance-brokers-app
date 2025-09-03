import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import aiService from "../../../../services/ai.service";
import api from "../../../../services/api";
import "./ai.css";

function AIAssistant() {
  const [entityType, setEntityType] = useState("insured");
  const [entityList, setEntityList] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [letterType, setLetterType] = useState("Policy Renewal");
  const [instructions, setInstructions] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch entities when entityType changes
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await api.get(`/${entityType}`);
        setEntityList(response.data || []);
        setSelectedEntity("");
      } catch (err) {
        console.error("Failed to fetch entities", err);
      }
    };
    fetchEntities();
  }, [entityType]);

  const handleGenerate = async () => {
    if (!selectedEntity) {
      alert(`Select a ${entityType} first!`);
      return;
    }
    setLoading(true);
    try {
      const response = await aiService.generateLetter({
        entityType,
        entityId: selectedEntity,
        letterType,
        instructions,
      });
      setGeneratedText(response.data.text);
    } catch (err) {
      console.error("Letter generation failed", err);
      alert("Failed to generate letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    alert("Copied to clipboard!");
  };

  return (
    <div className="ai-assistant-container">
      <h2 className="ai-title">AI Assistant – Generate Letter</h2>

      <Form className="ai-form">
        {/* Entity type */}
        <Form.Group>
          <Form.Label>Entity Type</Form.Label>
          <Form.Select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
          >
            <option value="insured">Insured</option>
            <option value="insurer">Insurer</option>
          </Form.Select>
        </Form.Group>

        {/* Entity dropdown */}
        <Form.Group>
          <Form.Label>Select {entityType}</Form.Label>
          <Form.Select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(parseInt(e.target.value))}
          >
            <option value="">-- Select {entityType} --</option>
            {entityList.map((item) => (
              <option
                key={item[`${entityType}_id`]}
                value={item[`${entityType}_id`]}
              >
                {item[`${entityType}_name`]}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Letter type */}
        <Form.Group>
          <Form.Label>Letter Type</Form.Label>
          <Form.Select
            value={letterType}
            onChange={(e) => setLetterType(e.target.value)}
          >
            <option>Policy Renewal</option>
            <option>Claim Update</option>
            <option>General Message</option>
          </Form.Select>
        </Form.Group>

        {/* Instructions */}
        <Form.Group>
          <Form.Label>Instructions (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </Form.Group>

        {/* Generated Letter */}
        <Form.Group>
          <Form.Label>Generated Letter</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
          />
        </Form.Group>

        {/* Buttons */}
        <div className="ai-buttons">
          <Button
            variant="secondary"
            onClick={() => setGeneratedText("")}
            className="ai-btn"
          >
            Clear
          </Button>
          <Button
            variant="success"
            onClick={handleCopy}
            className="ai-btn"
            disabled={!generatedText}
          >
            Copy
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            className="ai-btn"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Generate"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AIAssistant;
