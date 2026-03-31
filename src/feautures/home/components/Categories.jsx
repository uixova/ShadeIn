import React from 'react';
import '../css/Categories.css';

const Sidebar = ({ categories, selectedCategory, onCategoryChange, onCreateClick }) => {
  return (
    <aside className="category-sidebar">
      <div className="sidebar-section">
        <h3>Kategoriler</h3>
        <div className="category-list">
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`cat-item ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              <span className="dot"></span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <button className="create-btn" onClick={onCreateClick}>
          İçini Dök +
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;