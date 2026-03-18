import React, { useState } from 'react';
import './FarmingTips.css';

const FarmingTips = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'soil management',
    'irrigation',
    'pest control',
    'crop rotation',
    'organic farming',
    'harvesting'
  ];

  const tips = [
    {
      id: 1,
      title: 'Soil Testing: The First Step to Healthy Crops',
      category: 'soil management',
      summary: 'Test your soil every 2-3 years to check nutrient levels and pH. This helps in applying the right fertilizers and avoiding over-application.',
      icon: '🌱',
      readTime: '3 min',
      date: 'Mar 2026'
    },
    {
      id: 2,
      title: 'Drip Irrigation: Save Water, Increase Yield',
      category: 'irrigation',
      summary: 'Drip irrigation delivers water directly to plant roots, reducing evaporation and water usage by up to 50%. Perfect for water-scarce regions.',
      icon: '💧',
      readTime: '4 min',
      date: 'Feb 2026'
    },
    {
      id: 3,
      title: 'Natural Pest Control: Neem Oil Spray',
      category: 'pest control',
      summary: 'Mix 5 ml neem oil with 1 liter water and a few drops of soap. Spray on crops weekly to control aphids, whiteflies, and caterpillars.',
      icon: '🐞',
      readTime: '2 min',
      date: 'Mar 2026'
    },
    {
      id: 4,
      title: 'Crop Rotation Benefits for Soil Health',
      category: 'crop rotation',
      summary: 'Rotating crops prevents pest buildup, improves soil fertility, and reduces disease. For example, follow legumes with cereals.',
      icon: '🔄',
      readTime: '5 min',
      date: 'Jan 2026'
    },
    {
      id: 5,
      title: 'Organic Composting: Turn Waste into Wealth',
      category: 'organic farming',
      summary: 'Create compost from farm waste: layer green material (crop residues) with brown material (dry leaves) and keep moist. Turn every 2 weeks.',
      icon: '♻️',
      readTime: '6 min',
      date: 'Feb 2026'
    },
    {
      id: 6,
      title: 'Post-Harvest Handling: Reduce Losses',
      category: 'harvesting',
      summary: 'Harvest at the right maturity, cool produce immediately, and store in clean, ventilated areas to reduce post-harvest losses by up to 20%.',
      icon: '📦',
      readTime: '4 min',
      date: 'Mar 2026'
    },
    {
      id: 7,
      title: 'Green Manure: Natural Soil Enricher',
      category: 'soil management',
      summary: 'Grow quick-growing crops like sunn hemp or cowpea and plough them back into the soil. Adds organic matter and nitrogen.',
      icon: '🌿',
      readTime: '3 min',
      date: 'Dec 2025'
    },
    {
      id: 8,
      title: 'Weather-Based Irrigation Scheduling',
      category: 'irrigation',
      summary: 'Use evapotranspiration data to water crops only when needed. Saves water and prevents over-irrigation stress.',
      icon: '☀️',
      readTime: '5 min',
      date: 'Jan 2026'
    }
  ];

  // Filter tips based on search and category
  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tip.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="tips-page">
      <div className="tips-container">
        
        {/* Header */}
        <div className="tips-header">
          <h1>Farming Tips & Best Practices</h1>
          <p>Practical advice to improve your farm's productivity and sustainability</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="tips-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All Tips' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        {filteredTips.length > 0 ? (
          <div className="tips-grid">
            {filteredTips.map(tip => (
              <div className="tip-card" key={tip.id}>
                <div className="tip-icon">{tip.icon}</div>
                <div className="tip-content">
                  <h3>{tip.title}</h3>
                  <span className="tip-category">{tip.category}</span>
                  <p>{tip.summary}</p>
                  <div className="tip-meta">
                    <span className="read-time">⏱️ {tip.readTime} read</span>
                    <span className="tip-date">📅 {tip.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No tips match your search. Try different keywords.</p>
          </div>
        )}

        {/* Featured Tip Banner */}
        <div className="featured-tip">
          <div className="featured-icon">🌟</div>
          <div className="featured-content">
            <h3>Featured Tip: Soil Health Card Scheme</h3>
            <p>Get your soil tested for free under the Soil Health Card scheme. Visit your nearest agriculture office or Krishi Vigyan Kendra to apply.</p>
            <button className="featured-btn">Learn More</button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="tips-footer">
          <p>Tips are regularly updated based on ICAR recommendations and expert advice. Always consult local agricultural extension for region-specific guidance.</p>
        </div>

      </div>
    </div>
  );
};

export default FarmingTips;