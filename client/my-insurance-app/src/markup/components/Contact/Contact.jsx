import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import "./contact.css";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setAlert({ show: true, variant: "danger", message: "Please fill in all required fields." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3145/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setAlert({ show: true, variant: "success", message: "Message sent successfully!" });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setAlert({ show: true, variant: "danger", message: "Failed to send message. Try again later." });
      }
    } catch (error) {
      setAlert({ show: true, variant: "danger", message: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <div className="contact-hero text-center text-white">
        <div className="overlay">
          <motion.h1 initial="hidden" animate="visible" variants={fadeInUp}>
            Get in Touch With Us
          </motion.h1>
          <p>We’re here to answer your questions and provide expert guidance.</p>
        </div>
      </div>

      <Container className="py-5">
        <Row className="gy-5">
          {/* ===== Contact Form ===== */}
          <Col md={7}>
            <motion.div
              className="contact-form"
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true }}
            >
              <h3>Send Us a Message</h3>

              {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Enter your name"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    placeholder="Type your message..."
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="submit-btn" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Send Message"}
                </Button>
              </Form>
            </motion.div>
          </Col>
        </Row>
 {/* ===== Contact Info ===== */}
 <Col md={5}>
            <motion.div
              className="contact-info"
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true }}
            >
              <h3>Contact Information</h3>
              <p>
                📍 <strong>Address:</strong> Flamingo, ESMACO building (Ethiopian Human Rights Commission),
                2nd Floor, Addis Ababa, Ethiopia
              </p>
              <p>📞 <strong>Phone:</strong> +251-900-123-456</p>
              <p>📧 <strong>Email:</strong> abinsurancebro@gmail.com</p>
              <p>🕘 <strong>Hours:</strong> Mon–Sat, 8:30 AM – 5:00 PM</p>

              <div className="social-links">
                <a href="#">🌐 Facebook</a>
                <a href="#">🌐 LinkedIn</a>
                <a href="#">🌐 Twitter</a>
              </div>
            </motion.div>
          </Col>
        {/* ===== Google Map ===== */}
        <Row className="mt-5">
          <Col>
            <motion.div
              className="map-container"
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true }}
            >
              <iframe
                title="office-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.002!2d38.7578!3d9.0108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85b43a49cdb5%3A0x123456789!2sESMACO%20Building%2C%20Flamingo%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1690123456789"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactPage;