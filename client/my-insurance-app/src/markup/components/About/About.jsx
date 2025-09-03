import React from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaHandshake, FaLightbulb } from "react-icons/fa"; // ✅ use react-icons
import "./About.css";

function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Your Trusted Insurance Partners</h1>
          <p>
            With over 30 years of experience, we provide personalized insurance
            solutions to protect what matters most to you.
          </p>
        </motion.div>
      </section>

      {/* About Content */}
      <div>
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="about-text">
            <h2>About Our Company</h2>
            <p>
              Founded in 1988,{" "}
              <span className="highlight">
                Abiy & Binyam Insurance Brokers
              </span>{" "}
              has established itself as a leading provider of insurance
              solutions for individuals and businesses. Our mission is to
              simplify insurance and provide our clients with the protection
              they need at competitive rates.
            </p>
            <p>
              We understand that every client has unique needs, which is why we
              take the time to understand your specific situation before
              recommending coverage options. Our team of experienced
              professionals stays up-to-date with the latest industry trends to
              provide you with the best advice.
            </p>
            <div className="quote">
              "Your protection is our priority. We believe in building long-term
              relationships based on trust, transparency, and exceptional
              service."
            </div>
            <p>
              We partner with top-rated insurance carriers to offer a wide range
              of products including auto, home, life, health, and business
              insurance. Our goal is to be your one-stop shop for all your
              insurance needs.
            </p>
          </div>

          <motion.div
            className="about-image"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Insurance professionals discussing coverage options"
            />
            <div className="experience-badge">
              <span>30+ Years</span>
              <span>Of Trusted Service</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Values Section */}
      <section className="values-section">
        <div className="section-title">
          <h2>Our Values</h2>
          <p>The principles that guide our approach to service</p>
        </div>

        <div className="values-grid">
          <motion.div
            className="value-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="value-icon">
              <FaUserShield />
            </div>
            <h3>Client Protection</h3>
            <p>
              We prioritize your needs and work tirelessly to ensure you have
              the right coverage for your unique situation.
            </p>
          </motion.div>

          <motion.div
            className="value-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="value-icon">
              <FaHandshake />
            </div>
            <h3>Integrity</h3>
            <p>
              We believe in transparent communication and always acting in our
              clients' best interests.
            </p>
          </motion.div>

          <motion.div
            className="value-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="value-icon">
              <FaLightbulb />
            </div>
            <h3>Expertise</h3>
            <p>
              Our team continuously expands their knowledge to provide you with
              the most current insurance advice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { number: "1000+", label: "Clients Protected" },
            { number: "10+", label: "Insurance Partners" },
            { number: "98%", label: "Client Satisfaction" },
            { number: "30+", label: "Years of Experience" },
          ].map((stat, index) => (
            <motion.div
              className="stat-item"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-title">
          <h2>Our Leadership Team</h2>
          <p>Meet the experienced professionals behind our company</p>
        </div>

        <div className="team-grid">
          {[
            {
              name: "Abiy Masiresha",
              role: "Co-Founder & CEO",
              img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
            },
            {
              name: "Binyam Terfa",
              role: "Co-Founder & COO",
              img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
            },
            {
              name: "Kidist Kasa",
              role: "Chief Claims Advocate",
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
            },
          ].map((member, index) => (
            <motion.div
              className="team-member"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="member-image">
                <img src={member.img} alt={member.name} />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Get a Free Insurance Consultation</h2>
          <p>
            Contact us today to discuss your insurance needs and get
            personalized coverage recommendations.
          </p>
          <button className="cta-button">Request a Quote</button>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
