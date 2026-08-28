import React, { useState, useEffect } from 'react';
import { HiMenuAlt4, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

import { images, SECTIONS } from '../../constants';
import './Navbar.scss';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Highlight the nav item for whichever section is currently on screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: [0.25, 0.5, 0.75] },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Stop the page scrolling behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = toggle ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [toggle]);

  return (
    <nav className="app__navbar">
      <a href="#home" className="app__navbar-logo" aria-label="Khalil Fathalli — back to top">
        <img src={images.logo} alt="Khalil Fathalli logo" />
      </a>

      <ul className="app__navbar-links">
        {SECTIONS.map(({ id, label }) => (
          <li className={`app__flex p-text ${activeSection === id ? "is-active" : ""}`} key={`link-${id}`}>
            <div />
            <a href={`#${id}`} aria-current={activeSection === id ? 'true' : undefined}>
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="app__navbar-menu">
        <button
          type="button"
          className="app__navbar-menu-toggle"
          aria-label="Open navigation menu"
          aria-expanded={toggle}
          onClick={() => setToggle(true)}
        >
          <HiMenuAlt4 />
        </button>

        {/*
          Plain conditional render rather than AnimatePresence. With an exit
          animation the panel stayed mounted after closing — invisible and
          translated off screen, but still holding six tabbable links, so
          keyboard users tabbed into a menu they could not see.
        */}
        {toggle && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <button
              type="button"
              className="app__navbar-menu-close"
              aria-label="Close navigation menu"
              onClick={() => setToggle(false)}
            >
              <HiX />
            </button>
            <ul>
              {SECTIONS.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={activeSection === id ? 'true' : undefined}
                    onClick={() => setToggle(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
