import React from 'react';

/**
 * The single site-wide copyright line. Previously duplicated into every section
 * by AppWrap, and hardcoded to 2024.
 */
const SiteFooter = () => (
  <footer className="app__copyright">
    <p className="p-text">© {new Date().getFullYear()} Khalil Fathalli</p>
    <p className="p-text">All rights reserved</p>
  </footer>
);

export default SiteFooter;
