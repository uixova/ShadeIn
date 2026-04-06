import React from 'react';
import { fetchFeaturesApi } from '../services/landingServices';
import '../css/Feautures.css';

const Features = () => {
  const features = fetchFeaturesApi();

  return (
    <section className="features-grid">
      {features.map(f => (
        <article key={f.id} className="feature-card">
          <div className="f-icon"><i className={f.icon} aria-hidden="true"></i></div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </article>
      ))}
    </section>
  );
};

export default Features;