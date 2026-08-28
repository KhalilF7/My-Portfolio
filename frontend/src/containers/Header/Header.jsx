import React from 'react';
import { motion } from 'framer-motion';

import { AppWrap } from '../../wrapper';
import { images } from '../../constants';
import './Header.scss';

// Shown as a small "working with" strip under the intro.
const STACK = [
  { name: 'React', icon: images.react },
  { name: 'Angular', icon: images.angular },
  { name: 'Node.js', icon: images.node },
  { name: 'Spring Boot', icon: images.spring },
  { name: 'Laravel', icon: images.laravel },
];

const Header = () => (
  <header className="app__header">
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="app__header-info"
    >
      <p className="app__header-greeting">
        <span aria-hidden="true">👋</span> Hello, I am
      </p>

      {/*
        The page's single h1. The hidden half gives search engines and screen
        readers the full name and role — an h1 of just "Khalil" tells them
        very little, and "software engineer" is the term employers search for.
      */}
      <h1 className="app__header-name">
        Khalil
        <span className="sr-only"> Fathalli — Software Engineer and Full Stack Web Developer</span>
      </h1>

      <p className="app__header-role">Software Engineer &amp; Full&nbsp;Stack Web Developer</p>

      <p className="app__header-blurb">
        Master of Engineering in Computer Science, building fast, accessible web
        applications end to end — from database and API through to the interface
        people actually use.
      </p>

      <div className="app__header-ctas">
        <a href="#work" className="btn btn--primary">
          Explore my projects
        </a>
        <a href="#contact" className="btn btn--ghost">
          Get in touch
        </a>
      </div>

      <div className="app__header-stack">
        <p className="app__header-stack-label">Working with</p>
        <ul className="app__header-stack-list">
          {STACK.map(({ name, icon }) => (
            <li key={name} title={name}>
              <img src={icon} alt={name} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
      className="app__header-img"
    >
      {/*
        The hero image is the largest paint on first load, so it is eager and
        high priority rather than lazy.
      */}
      <img
        src={images.profile}
        alt="Khalil Fathalli, software engineer"
        fetchpriority="high"
        className="app__header-portrait"
      />
      <img
        src={images.circle}
        alt=""
        aria-hidden="true"
        className="app__header-circle"
      />
    </motion.div>
  </header>
);

export default AppWrap(Header, 'home');
