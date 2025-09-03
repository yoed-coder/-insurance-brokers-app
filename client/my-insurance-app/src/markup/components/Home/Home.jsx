import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion"; // ✅ Added import
import Div from "../Div/Div";
import "./home.css";

function HomePage() {
  useEffect(() => {
    const cards = document.querySelectorAll(".flip-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // reveal once
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
  }, []);

  // ✅ Define the missing handler
  const handleContactClick = () => {
    // Scroll to contact section OR navigate to /contact
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/contact"; // fallback
    }
  };

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <div className="hero-section text-center text-white d-flex align-items-center">
        <Container>
          <h1 className="hero-heading">
            Welcome to <span className="ab">Abiy & Binyam</span> Insurance Brokers
          </h1>
          <p className="lead">
            Protecting what matters most — with 30+ years of trusted experience.
          </p>
        </Container>
      </div>

      {/* ===== About Section ===== */}
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6} className="choo">
            <h2>Why Choose Us?</h2>
            <p className="not">
              <strong>
                Not sure how, where, or what kind of policy to buy? Don’t worry —
                we’re here to help.
              </strong>
              With over 30 years of experience in the insurance industry, our
              team provides expert consultation tailored to your needs. From
              choosing the right policy to handling claims, we’ll be by your
              side every step of the way.
            </p>
          </Col>
          <Col md={6} className="choo">
            <h2>Do We Charge You Any Extra Fees?</h2>
            <p className="not">
              <strong>No hidden costs — our service is completely free for you.</strong>
              <br />
              We earn our commission directly from the insurance companies, not
              from our clients. That means you get expert advice, multiple
              options, and the best coverage at the same price (or even better)
              than going directly to an insurer.
            </p>
          </Col>
        </Row>
      </Container>

      {/* ===== Services Section ===== */}
      <Container className="py-5">
        <h2 className="text-center mb-4" id="center">
          Our Services
        </h2>
        <Row className="row-1">
          {[
            {
              title: "🧑‍💼 Personalized Consultation",
              desc: "We guide you in selecting the best coverage for your assets and lifestyle.",
            },
            {
              title: "📑 Full Policy Management",
              desc: "From purchase to renewal, we make sure your policies are always up to date.",
            },
            {
              title: "⚖️ Claim Support",
              desc: "Our senior underwriters and claim officers ensure fair, fast, and smooth claim handling.",
            },
            {
              title: "⭐ Trusted Reputation",
              desc: "Our management team is highly respected in the insurance field.",
            },
          ].map((service, index) => (
            <Col md={3} key={index}>
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <h5>{service.title}</h5>
                  </div>
                  <div className="flip-card-back">
                    <p>{service.desc}</p>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <Div />

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
                <p>
                  Get a personalized insurance plan that fits your needs and
                  budget
                </p>
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
    </div>
  );
}

export default HomePage;
 