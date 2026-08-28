import React from 'react';
import { motion } from 'framer-motion';

import { AppWrap } from '../../wrapper';
import { images } from '../../constants';
import './Header.scss';

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: { duration: 1, ease: 'easeInOut' },
  },
};

const Header = () => (
  <div className="app__header app__flex">
    <motion.div
      whileInView={{ x: [-100, 0], opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      className="app__header-info"
    >
      <div className="app__header-badge">
        <div className="badge-cmp app__flex">
          <span aria-hidden="true">👋</span>
          <div style={{ marginLeft: 20 }}>
            <p className="p-text">Hello, I am</p>
            {/*
              The page's single h1. The hidden part gives search engines and
              screen readers the full name and role — an h1 of just "Khalil"
              tells them very little.
            */}
            <h1 className="head-text">
              Khalil
              <span className="sr-only"> Fathalli — Software Engineer and Full Stack Web Developer</span>
            </h1>
          </div>
        </div>

        <div className="tag-cmp app__flex">
          <p className="p-text">Software Engineer</p>
          <p className="p-text">Full Stack Web Developer</p>
        </div>

        <a href="#work">
          <motion.button type="button" className="cta-btn" whileTap={{ scale: 0.97 }}>
            Explore My Projects
          </motion.button>
        </a>
      </div>
    </motion.div>

    <motion.div
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, delayChildren: 0.5 }}
      className="app__header-img"
    >
      {/*
        The hero image is the largest paint on first load, so it is eager and
        high priority rather than lazy.
      */}
      <img src={images.profile} alt="Khalil Fathalli" fetchpriority="high" />
      <motion.img
        whileInView={{ scale: [0, 1] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        src={images.circle}
        alt=""
        aria-hidden="true"
        className="overlay_circle"
      />
    </motion.div>

    <motion.div
      variants={scaleVariants}
      whileInView={scaleVariants.whileInView}
      className="app__header-circles"
      aria-hidden="true"
    >
      {[images.react, images.angular, images.redux].map((circle, index) => (
        <div className="circle-cmp app__flex" key={`circle-${index}`}>
          <img src={circle} alt="" loading="lazy" />
        </div>
      ))}
    </motion.div>
  </div>
);

export default AppWrap(Header, 'home');
