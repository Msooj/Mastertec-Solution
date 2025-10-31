// src/FAQ.js
import React from "react";

function FAQ() {
  return (
    <div className="faq" style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", background: "#fafafa", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Frequently Asked Questions</h2>
      
      <div style={{ marginBottom: "16px" }}>
        <strong>Q: How do I order?</strong>
        <p>A: Just add products to your cart and proceed to checkout!</p>
      </div>
      
      <div style={{ marginBottom: "16px" }}>
        <strong>Q: What payment methods are accepted?</strong>
        <p>A: We accept M-Pesa Paybill, debit/credit cards, and cash on delivery.</p>
      </div>
      
      <div style={{ marginBottom: "16px" }}>
        <strong>Q: Can I track my order?</strong>
        <p>A: Yes! You'll receive tracking info after placing your order.</p>
      </div>
      
      <div style={{ marginBottom: "16px" }}>
        <strong>Q: How do I contact support?</strong>
        <p>A: Use the contact form on our website or reach out via WhatsApp, email, or call.</p>
      </div>
      
      {/* Add more Q&As here as needed */}
    </div>
  );
}

export default FAQ;
