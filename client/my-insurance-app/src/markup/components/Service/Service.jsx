import React, { useState } from "react";
import { Container, Row, Col, Button, Accordion, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import policy from "../../../assets/image/policy.jpg";
import work from "../../../assets/image/work.jpg";
import claim from "../../../assets/image/claim.jpg";
import office from "../../../assets/image/office.jpg";
import free from "../../../assets/image/free.jpg";
import ContactPage from "../Contact/Contact"; 
import "./service.css";

function ServicesPage() {
  const fadeInUp = { 
    hidden: { opacity: 0, y: 50 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } 
  };
  
  const [showContact, setShowContact] = useState(false);
  const [activeService, setActiveService] = useState(null);

  const handleContactClick = () => {
    setShowContact(true);
    setTimeout(() => {
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const toggleService = (index) => {
    setActiveService(activeService === index ? null : index);
  };

  const services = [
    {
      title: "🧑‍💼 Personalized Consultation",
      description: "Choosing the right insurance can be confusing. Our experts analyze your situation and provide tailored advice, explain coverage types, exclusions, and benefits, and help you make an informed decision.",
      features: [
        "Life, health, auto, and property insurance",
        "Coverage recommendations based on your needs",
        "Risk assessment and financial planning tips"
      ],
      image: policy
    },
    {
      title: "📑 Full Policy Management",
      description: "We offer end-to-end support from purchase to renewal. Stay organized with updates, alerts, and review reports so you never miss an important deadline.",
      features: [
        "Annual insurance review reports",
        "Policy consolidation and optimization",
        "Alerts for upcoming renewals or changes"
      ],
      image: work
    },
    {
      title: "⚖️ Claim Support",
      description: "We simplify filing claims. Our specialists gather documents, submit forms, and negotiate with insurers for fast and fair settlements.",
      features: [
        "Auto accident claims guidance",
        "Property damage claims and adjuster liaison",
        "Life and health claims assistance"
      ],
      image: claim
    },
    {
      title: "⭐️ Trusted Reputation",
      description: "With over 35 years in the industry, we maintain long-term relationships with insurers, ensuring access to the best policies at competitive rates.",
      features: [
        "Over 2,000 satisfied clients",
        "Partnerships with 20+ top insurance companies",
        "Recognized in industry awards for excellence"
      ],
      image: office
    }
  ];

  const faqs = [
    {
      question: "How long does it take to get a policy?",
      answer: "Typically, we can get you covered within 24-48 hours depending on the type of insurance and your specific circumstances."
    },
    {
      question: "Can I change my coverage later?",
      answer: "Yes, we make it easy to adjust your coverage as your life circumstances change. Just contact us for a policy review."
    },
    {
      question: "What makes your service different?",
      answer: "We're independent advisors, not tied to any single insurance company. This means we always recommend what's truly best for you."
    },
    {
      question: "How do I file a claim?",
      answer: "You can call our dedicated claims hotline 24/7, and we'll guide you through the entire process and advocate on your behalf."
    }
  ];

  return (
    <div className="services-page">
      {/* ===== Hero Section ===== */}
      <section className="services-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1>Comprehensive Insurance Services</h1>
                <p className="lead">
                  Protecting what matters most to you with personalized insurance solutions and expert guidance.
                </p>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="cta-button"
                  onClick={handleContactClick}
                >
                  Get a Free Quote
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ===== Services Section ===== */}
      <section className="services-section">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                className="section-title"
              >
                Our Services
              </motion.h2>
              <motion.p 
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                className="section-subtitle"
              >
                We provide end-to-end insurance solutions tailored to your unique needs
              </motion.p>
            </Col>
          </Row>

          <Row className="services-container">
            {services.map((service, index) => (
              <Col lg={12} className="mb-5" key={index}>
                <motion.div 
                  className={`service-card ${index % 2 === 0 ? '' : 'service-card-reverse'}`}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeInUp}
                  viewport={{ once: true }}
                >
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                  </div>
                  <div className="service-content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className={`service-features ${activeService === index ? 'expanded' : ''}`}>
                      <ul>
                        {service.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div 
                      className="service-indicator"
                      onClick={() => toggleService(index)}
                    >
                      {activeService === index ? '▲ See Less' : '▼ See More'}
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ===== Stats Section ===== */}
      <section className="stats-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={3} sm={6} className="text-center mb-4">
              <motion.div 
                className="stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2>30+</h2>
                <p>Years of Experience</p>
              </motion.div>
            </Col>
            <Col md={3} sm={6} className="text-center mb-4">
              <motion.div 
                className="stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h2>1000+</h2>
                <p>Satisfied Clients</p>
              </motion.div>
            </Col>
            <Col md={3} sm={6} className="text-center mb-4">
              <motion.div 
                className="stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2>10+</h2>
                <p>Insurance Partners</p>
              </motion.div>
            </Col>
            <Col md={3} sm={6} className="text-center mb-4">
              <motion.div 
                className="stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h2>24/7</h2>
                <p>Claim Support</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="faq-section">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                className="section-title"
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p 
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                className="section-subtitle"
              >
                Find answers to common questions about our insurance services
              </motion.p>
            </Col>
          </Row>
          
          <Row>
            <Col lg={6} className="mb-4">
              <motion.div 
                className="faq-content"
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
              >
                <Accordion defaultActiveKey="0" className="faq-accordion">
                  {faqs.map((faq, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index} className="mb-3">
                      <Accordion.Header>
                        <span className="faq-question">{faq.question}</span>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div 
                className="faq-promo-card"
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
              >
                <div className="faq-promo-content">
                  <div className="promo-icon">💰</div>
                  <h3>No Extra Fees</h3>
                  <p>
                    Our services are completely free because we are compensated by the insurance companies. 
                    You get unbiased advice, multiple coverage options, and trusted expertise without any extra cost.
                  </p>
                  <div className="promo-features">
                    <div className="promo-feature">
                      <span className="feature-check">✓</span>
                      <span>No hidden charges</span>
                    </div>
                    <div className="promo-feature">
                      <span className="feature-check">✓</span>
                      <span>Transparent pricing</span>
                    </div>
                    <div className="promo-feature">
                      <span className="feature-check">✓</span>
                      <span>Price match guarantee</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="cta-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <h2>Ready to secure your future?</h2>
                <p>Get a personalized insurance plan that fits your needs and budget</p>
                <Button 
                  variant="light" 
                  size="lg" 
                  className="cta-button"
                  onClick={handleContactClick}
                >
                  Contact Us Today
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ===== Contact Section ===== */}
      {showContact && (
        <div id="contact-form">
          <ContactPage />
        </div>
      )}
    </div>
  );
}

export default ServicesPage;