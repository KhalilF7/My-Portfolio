import React from 'react';

import { NavigationDots, SocialMedia } from '../components';
import { SECTIONS } from '../constants';

/**
 * Wraps a container as a full-height page section.
 *
 * The copyright block used to live in here, which meant it rendered once per
 * section — six times down the page. It now lives in <SiteFooter /> and appears
 * once, at the bottom, as a real <footer>.
 */
const AppWrap = (Component, idName, className = '') => function HOC() {
  const label = SECTIONS.find((section) => section.id === idName)?.label || idName;

  return (
    <section id={idName} className={`app__container ${className}`} aria-label={label}>
      <SocialMedia />
      <div className="app__wrapper app__flex">
        <Component />
      </div>
      <NavigationDots active={idName} />
    </section>
  );
};

export default AppWrap;
