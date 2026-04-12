import React, { useState } from 'react';
import '../css/FAQ.css';

const FAQ = ({ faqs, forwardRef }) => {
  const [activeFaq, setActiveFaq] = useState(null);

  // Googlebot için JSON-LD Şeması hazırlıyoruz
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <section ref={forwardRef} className="faq-section" id="faq">
      {/* Şemayı sayfaya enjekte ediyoruz */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      <div className="section-intro">
        <span className="badge-small">SSS</span>
        <h2 className="section-title">Merak Edilenler</h2>
      </div>

      <div className="faq-list">
        {faqs.map((item) => (
          <article 
            key={item.id} 
            className={`faq-card ${activeFaq === item.id ? 'active' : ''}`}
            onClick={() => setActiveFaq(activeFaq === item.id ? null : item.id)}
          >
            <div className="faq-header">
              <span>{item.q}</span>
              <i className="ti ti-chevron-down"></i>
            </div>
            <div className="faq-body">
              <div className="faq-body-content">{item.a}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FAQ;