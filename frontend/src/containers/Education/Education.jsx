import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

import { AppWrap, MotionWrap } from '../../wrapper';
import { imageUrl, client } from '../../client';
import './Education.scss';

/**
 * Maps a legacy `testimonials` document onto the `education` shape.
 *
 * The old type stored education entries with the years packed into a free-text
 * `feedback` field, e.g. "2020-2023".
 */
const normaliseLegacy = (doc) => {
  const years = String(doc.feedback || '').match(/\d{4}/g) || [];

  return {
    _id: doc._id,
    degree: doc.name,
    school: doc.company,
    startYear: years[0] ? Number(years[0]) : undefined,
    endYear: years[1] ? Number(years[1]) : undefined,
    logo: doc.imageurl,
  };
};

/**
 * Previously named "Testimonial" while displaying education entries. It reads
 * the dedicated `education` type, which stores start/end years as real numbers.
 *
 * It falls back to the legacy `testimonials` documents when `education` is
 * empty, so the section keeps working before the migration is run and there is
 * never a point where the entries look lost.
 */
const Education = () => {
  const [education, setEducation] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [current, legacy, brandData] = await Promise.all([
          client.fetch('*[_type == "education"]'),
          // Fallback, see normaliseLegacy above.
          client.fetch('*[_type == "testimonials"]'),
          client.fetch('*[_type == "brands"] | order(name asc)'),
        ]);

        if (cancelled) return;

        const entries = (current.length ? current : legacy.map(normaliseLegacy))
          .slice()
          .sort((a, b) => (b.endYear || b.startYear || 0) - (a.endYear || a.startYear || 0));

        setEducation(entries);
        setBrands(brandData);
      } catch (err) {
        console.error('Failed to load the education section:', err);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const total = education.length;
  const current = education[currentIndex];

  const go = (delta) => setCurrentIndex((i) => (i + delta + total) % total);

  /**
   * Preload every school logo once the entries arrive, so stepping through them
   * does not show an empty circle while the next logo downloads.
   */
  useEffect(() => {
    education.forEach((entry) => {
      if (!entry.logo) return;
      const img = new Image();
      img.src = imageUrl(entry.logo, 150);
    });
  }, [education]);

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
                loading="eager"
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
