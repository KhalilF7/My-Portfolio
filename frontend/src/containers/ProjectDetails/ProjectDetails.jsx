import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi';

import { imageUrl } from '../../client';
import { formatDate, isOngoing } from '../../utils';
import './ProjectDetails.scss';

const OWNER = 'Khalil Fathalli';

// Generic job titles. When the owner's role on a project is one of these there
// is no specific module to name, so the sentence is written without one.
const GENERIC_ROLES = [
  'full stack developer',
  'front-end developer',
  'php web developer',
  'software developer',
];

/**
 * The module the owner built on this project, or null when their role was a
 * generic developer title.
 *
 * This logic used to sit inside JSX as a .map() that returned null for most
 * members, rendered in the middle of a sentence.
 */
const getOwnerModule = (members = []) => {
  const owner = members.find((member) => member.name === OWNER);
  if (!owner || !owner.role) return null;
  return GENERIC_ROLES.includes(owner.role.trim().toLowerCase()) ? null : owner.role;
};

const ProjectDetails = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const technologies = project.technologies || [];
  const members = project.members || [];
  // Memoised: `|| []` would hand back a new array on every render, re-running
  // the preload effect below each time.
  const results = useMemo(() => project.results || [], [project.results]);

  const ownerModule = getOwnerModule(members);
  const totalResults = results.length;

  // Same URLs the <img> below renders, so the preload below hits the same cache entry.
  const resultImages = useMemo(
    () => results.map((result) => imageUrl(result.results, 700)),
    [results],
  );

  /**
   * Preload every result image as soon as the modal opens.
   *
   * The images used to be loading="lazy", so a slide's image only began
   * downloading once you navigated to it: the first visit to each slide showed
   * an empty frame and then the image popped in. Fetching them all up front
   * means the swap is instant, and `readySrcs` lets the first one fade in
   * instead of appearing abruptly.
   */
  const [readySrcs, setReadySrcs] = useState(() => new Set());

  useEffect(() => {
    let cancelled = false;

    resultImages.forEach((src) => {
      if (!src) return;

      const markReady = () => {
        if (cancelled) return;
        setReadySrcs((prev) => {
          if (prev.has(src)) return prev;
          const next = new Set(prev);
          next.add(src);
          return next;
        });
      };

      const img = new Image();
      img.src = src;
      if (img.complete) {
        markReady();
      } else {
        img.onload = markReady;
        // Treat a failed image as settled too, so it does not sit on the skeleton forever.
        img.onerror = markReady;
      }
    });

    return () => { cancelled = true; };
  }, [resultImages]);

  const goToResult = (delta) => setCurrentIndex((i) => (i + delta + totalResults) % totalResults);

  const currentResult = results[currentIndex];
  const currentSrc = resultImages[currentIndex];
  const isCurrentReady = !currentSrc || readySrcs.has(currentSrc);

  const resultsIntro = ownerModule
    ? `The functionality and user experience of the ${ownerModule} module I designed and developed.`
    : 'The functionality and user experience I designed and developed.';

  return (
    <div className="app__project-details">
      {onClose && (
        <button
          type="button"
          className="app__project-details-close"
          aria-label="Close project details"
          onClick={onClose}
        >
          <HiX aria-hidden="true" />
        </button>
      )}

      <h2 className="app__project-details-title">{project.title}</h2>

      {/* An ongoing project has no end date, so it gets its own sentence
          rather than being hidden entirely. */}
      {project.startDate && (
        isOngoing(project.endDate) ? (
          <p className="app__project-details-date">
            Started <strong>{formatDate(project.startDate)}</strong> and still ongoing.
          </p>
        ) : (
          <p className="app__project-details-date">
            This project ran from <strong>{formatDate(project.startDate)}</strong> to
            {' '}
            <strong>{formatDate(project.endDate)}</strong>.
          </p>
        )
      )}

      <p className="app__project-details-description">{project.description}</p>

      {project.role && (
        <section className="app__project-details-section">
          <h3 className="app__project-details-section-title">My role</h3>
          <p className="app__project-details-section-content">{project.role}</p>
        </section>
      )}

      {technologies.length > 0 && (
        <section className="app__project-details-section">
          <h3 className="app__project-details-section-title">Technologies</h3>
          <motion.ul
            className="app__project-details-section-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {technologies.map((tech, index) => (
              <motion.li
                className="app__project-details-section-list-item"
                key={tech._key || tech.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <div
                  className="app__project-details-section-list-item-icon"
                  style={{ backgroundColor: tech.bgColor }}
                >
                  {tech.icon && (
                    <img
                      src={imageUrl(tech.icon, 40)}
                      alt=""
                      aria-hidden="true"
                      className="app__project-details-section-list-item-icon-img"
                      loading="lazy"
                    />
                  )}
                </div>
                <p className="app__project-details-section-list-item-text">{tech.name}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>
      )}

      {members.length > 0 && (
        <section className="app__project-details-section">
          <h3 className="app__project-details-section-title">Team</h3>
          <motion.ul
            className="app__project-details-section-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {members.map((member, index) => (
              <motion.li
                className="app__project-details-section-list-item"
                key={member._key || member.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                {member.photo && (
                  <img
                    src={imageUrl(member.photo, 60)}
                    alt={member.name}
                    className="app__project-details-section-list-item-photo"
                    loading="lazy"
                  />
                )}
                <div className="app__project-details-section-list-item-info">
                  <p className="app__project-details-section-list-item-info-name">{member.name}</p>
                  <p className="app__project-details-section-list-item-info-role">{member.role}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </section>
      )}

      {totalResults > 0 && (
        <section className="app__project-details-section">
          <h3 className="app__project-details-section-title">Results</h3>
          <p className="app__project-details-section-content">{resultsIntro}</p>

          {/*
            No key={currentIndex} on the panel any more. Keying on the index
            remounted it on every step, which threw away the loaded <img> and
            replayed a slide-in animation over an empty frame.
          */}
          <div className="app__result-item">
            <h4 className="bold-text">{currentResult.title}</h4>

            {/*
              The arrows live inside the figure so they stay centred on the
              image. Sitting beside the whole panel, they shifted between slides
              because descriptions differ in length.
            */}
            <div className="app__result-figure">
              {currentSrc && (
                <img
                  src={currentSrc}
                  alt={currentResult.title}
                  // Eager: these are preloaded above and swapped by the arrows,
                  // so there is nothing to defer.
                  loading="eager"
                  decoding="async"
                  className={isCurrentReady ? 'is-ready' : ''}
                />
              )}
              {!isCurrentReady && <span className="app__result-skeleton" aria-hidden="true" />}

              {totalResults > 1 && (
                <>
                  <button
                    type="button"
                    className="app__result-btn app__result-btn--prev app__flex"
                    aria-label="Previous result"
                    onClick={() => goToResult(-1)}
                  >
                    <HiChevronLeft aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="app__result-btn app__result-btn--next app__flex"
                    aria-label="Next result"
                    onClick={() => goToResult(1)}
                  >
                    <HiChevronRight aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <div className="app__result-content">
              <p className="p-text">{currentResult.description}</p>
            </div>
          </div>

          {totalResults > 1 && (
            <p className="app__result-counter p-text" aria-live="polite">
              {currentIndex + 1} / {totalResults}
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default ProjectDetails;
