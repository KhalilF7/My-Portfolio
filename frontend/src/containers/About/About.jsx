import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import { imageUrl, client } from '../../client';
import './About.scss';

const About = () => {
  const [abouts, setAbouts] = useState([]);

  useEffect(() => {
    client
      .fetch('*[_type == "abouts"]')
      .then(setAbouts)
      .catch((err) => console.error('Failed to load about entries:', err));
  }, []);

  return (
    <>
      <h2 className="head-text">
        I know that <span>good apps</span>
        <br />
        mean <span>good business</span>
      </h2>

      <div className="app__profiles">
        {abouts.map((about, index) => (
          <motion.div
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, type: 'tween' }}
            className="app__profile-item"
            key={about._id || `${about.title}-${index}`}
          >
            <img src={imageUrl(about.imgUrl, 200)} alt={about.title} loading="lazy" />
            {/* h3, not h2 — these sit underneath the section's own h2. */}
            <h3 className="bold-text">{about.title}</h3>
            <p className="p-text">{about.description}</p>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(About, 'app__about'),
  'about',
  'app__whitebg',
);
