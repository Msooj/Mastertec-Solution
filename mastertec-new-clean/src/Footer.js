// src/Footer.js
import React from "react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import "./App.css"; // Assumes styles are in App.css

const Footer = () => (
  <footer id="about-footer" className="footer"> {/* <-- ID added! */}
    <div className="footer-about">
      <h4>About Us</h4>
      <p>
        Mastertec Solutions provides expert security solutions (CCTV, alarms, access control, electric fences, and more), serving homes and businesses in Kenya with professional installation and service.<br />
        WhatsApp:{" "}
        <a href="https://wa.me/254790999150?text=Hello%20Mastertec%20Solutions" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp style={{ verticalAlign: "middle", color: "#25d366" }} /> <span style={{ color: "#ff9500" }}>0790999150</span>
        </a><br />
        Email:{" "}
        <a href="mailto:mastertecltd@gmail.com" target="_blank" rel="noopener noreferrer">
          <span style={{ color: "#ff9500" }}>mastertecltd@gmail.com</span>
        </a>
      </p>
    </div>
    <div className="footer-socials">
      <a href="https://www.facebook.com/MastervisionTechnologies/" target="_blank" rel="noopener noreferrer">
        <FaFacebook style={{ verticalAlign: "middle", color: "#4267B2" }} /> Facebook
      </a>
      {" | "}
      <a href="https://www.instagram.com/mastervision.tec/?utm_source=qr#" target="_blank" rel="noopener noreferrer">
        <FaInstagram style={{ verticalAlign: "middle", color: "#E4405F" }} /> Instagram
      </a>
      {" | "}
      <a href="https://www.tiktok.com/@mastervisiontec?_t=ZM-90qKa16zo3n&_r=1" target="_blank" rel="noopener noreferrer">
        <FaTiktok style={{ verticalAlign: "middle", color: "#000" }} /> TikTok
      </a>
    </div>
  </footer>
);

export default Footer;
