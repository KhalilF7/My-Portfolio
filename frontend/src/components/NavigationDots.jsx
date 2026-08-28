import React from 'react';

import { SECTIONS } from '../constants';

const NavigationDots = ({ active }) => (
  <div className="app__navigation">
    {SECTIONS.map(({ id, label }) => (
      <a
        href={`#${id}`}
        key={id}
        className={`app__navigation-dot ${active === id ? 'app__navigation-dot--active' : ''}`}
      >
        {/* The dot itself is decorative CSS, so the link needs readable text. */}
        <span className="sr-only">{`Go to ${label}`}</span>
      </a>
    ))}
  </div>
);

export default NavigationDots;
