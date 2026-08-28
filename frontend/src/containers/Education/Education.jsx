import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

import { AppWrap, MotionWrap } from '../../wrapper';
import { imageUrl, client } from '../../client';
import './Education.scss';

/**
 * Previously named "Testimonial" while displaying education entries. It now
 * reads the dedicated `education` document type, which stores start/end years
 * as real numbers instead of parsing them out of a free-text field.
 */
const Education = () => {
  const [education, setEducation] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    client
      .fetch('*[_type == "education"] | order(coalesce(endYear, startYear) desc)')
      .then(setEducation)
      .catch((err) => console.error('Failed to load education:', err));

    client
      .fetch('*[_type == "brands"] | order(name asc)')
      .then(setBrands)
      .catch((err) => console.error('Failed to load companies:', err));
  }, []);

  const total = education.length;
  const current = education[currentIndex];

  const go = (delta) => setCurrentIndex((i) => (i + delta + total) % total);

  const formatYears = ({ startYear, endYear }) => {
    if (!startYear) return '';
    return endYear ? `${startYear} – ${endYear}` : `${startYear} – Present`;
  };

  return (
    <>
      <h2 className="head-text">
        My <span>Education</span>
      </h2>

      <p className="section-subtitle">
        Engineering degrees in computer science, with a focus on software
        architecture and web development.
      </p>

      {current && (
        <>
          <article className="app__education-item app__flex">
            {current.logo && (
              <img
                src={imageUrl(current.logo, 150)}
                alt={`${current.school} logo`}
                loading="lazy"
                width="150"
                height="150"
              />
            )}
            <div className="app__education-content">
              <div>
                <h3 className="bold-text">{current.degree}</h3>
                <p className="app__education-school">{current.school}</p>
                <p className="app__education-years">{formatYears(current)}</p>
                {current.description && (
                  <p className="p-text app__education-description">{current.description}</p>
                )}
              </div>
            </div>
          </article>

          {/* Arrows are pointless with a single entry. */}
          {total > 1 && (
            <div className="app__education-btns app__flex">
              <button type="button" className="app__flex" aria-label="Previous qualification" onClick={() => go(-1)}>
                <HiChevronLeft aria-hidden="true" />
              </button>
              <p className="app__education-counter p-text" aria-live="polite">
                {currentIndex + 1} / {total}
              </p>
              <button type="button" className="app__flex" aria-label="Next qualification" onClick={() => go(1)}>
                <HiChevronRight aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}

      {brands.length > 0 && (
        <div className="app__education-brands-wrapper">
          <h3 className="app__education-brands-title">Companies I have worked with</h3>
          <div className="app__education-brands app__flex">
            {brands.map((brand) => (
              <motion.div
                whileInView={{ opacity: [0, 1] }}
                transition={{ duration: 0.5, type: 'tween' }}
                key={brand._id}
              >
                <img
                  src={imageUrl(brand.imgUrl, 150)}
                  alt={brand.name}
                  title={brand.name}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Education, 'app__education'),
  'education',
  'app__primarybg',
);
