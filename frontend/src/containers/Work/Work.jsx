import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Modal from 'react-modal';
import { AiFillEye, AiFillGithub } from 'react-icons/ai';
import { motion } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import { imageUrl, client } from '../../client';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import './Work.scss';

const ALL = 'All';

// Works carry a literal "All" tag alongside their real ones; it is a filter
// sentinel, not a label worth showing on the card.
const primaryTag = (work) => (work.tags || []).find((tag) => tag !== ALL);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const Work = () => {
  const [works, setWorks] = useState([]);
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
  const [project, setProject] = useState(null);
  const [detailTitles, setDetailTitles] = useState(new Set());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [workData, detailTitleList] = await Promise.all([
          client.fetch('*[_type == "works"] | order(startDate desc)'),
          // Was one request per work item; now a single query.
          client.fetch('*[_type == "projectDetails"].title'),
        ]);

        if (cancelled) return;
        setWorks(workData);
        setDetailTitles(new Set(detailTitleList));
      } catch (err) {
        console.error('Failed to load works:', err);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  // Filters come from the tags actually present in Sanity, so adding a project
  // with a new tag no longer means editing a hardcoded array in this file.
  // "All" is first because it is the default selection.
  const filters = useMemo(() => {
    const tags = new Set();
    works.forEach((work) => (work.tags || []).forEach((tag) => tags.add(tag)));
    // Every work in Sanity also carries a literal "All" tag, which would show up
    // as a second All button next to the real one.
    tags.delete(ALL);
    return [ALL, ...[...tags].sort((a, b) => a.localeCompare(b))];
  }, [works]);

  const visibleWorks = useMemo(() => (
    activeFilter === ALL
      ? works
      : works.filter((work) => (work.tags || []).includes(activeFilter))
  ), [works, activeFilter]);

  const handleWorkFilter = (item) => {
    if (item === activeFilter) return;
    setAnimateCard({ y: 60, opacity: 0 });

    setTimeout(() => {
      setActiveFilter(item);
      setAnimateCard({ y: 0, opacity: 1 });
    }, 300);
  };

  const openDetails = useCallback(async (title) => {
    try {
      const [details] = await client.fetch(
        '*[_type == "projectDetails" && title == $title][0...1]',
        { title },
      );
      if (details) setProject(details);
    } catch (err) {
      console.error('Failed to load project details:', err);
    }
  }, []);

  return (
    <>
      <h2 className="head-text">
        My Creative <span>Portfolio</span>
      </h2>

      <p className="section-subtitle">
        Full stack web and mobile projects built with React, Angular, Spring Boot,
        Laravel and Symfony.
      </p>

      <div className="app__work-filter" role="tablist" aria-label="Filter projects by technology">
        {filters.map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === item}
            key={item}
            onClick={() => handleWorkFilter(item)}
            className={`app__work-filter-item app__flex p-text ${activeFilter === item ? 'item-active' : ''}`}
          >
            {item}
          </button>
        ))}
      </div>

      <motion.div
        animate={animateCard}
        transition={{ duration: 0.35 }}
        className="app__work-portfolio"
      >
        {visibleWorks.map((work) => (
          <div className="app__work-item app__flex" key={work._id || work.title}>
            <div className="app__work-img app__flex">
              <img src={imageUrl(work.imgUrl, 320)} alt={work.title} loading="lazy" />

              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="app__work-hover app__flex"
              >
                {work.projectLink && (
                  <a
                    href={work.projectLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`View ${work.title} live (opens in a new tab)`}
                  >
                    <motion.div whileHover={{ scale: 0.9 }} transition={{ duration: 0.25 }} className="app__flex">
                      <AiFillEye aria-hidden="true" />
                    </motion.div>
                  </a>
                )}
                {work.codeLink && (
                  <a
                    href={work.codeLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`View ${work.title} source code on GitHub (opens in a new tab)`}
                  >
                    <motion.div whileHover={{ scale: 0.9 }} transition={{ duration: 0.25 }} className="app__flex">
                      <AiFillGithub aria-hidden="true" />
                    </motion.div>
                  </a>
                )}
              </motion.div>
            </div>

            <div className="app__work-content app__flex">
              <h3 className="bold-text">{work.title}</h3>
              <p className="p-text work-dates">
                {formatDate(work.startDate)} – {formatDate(work.endDate)}
              </p>
              <p className="p-text work-description">{work.description}</p>

              {primaryTag(work) && (
                <div className="app__work-tag app__flex">
                  <p className="p-text">{primaryTag(work)}</p>
                </div>
              )}

              {detailTitles.has(work.title) && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openDetails(work.title)}
                  className="app__work-details app__flex"
                >
                  More Details
                </motion.button>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Single modal for the section — previously one per card. */}
      <Modal
        isOpen={project !== null}
        onRequestClose={() => setProject(null)}
        className="modal"
        overlayClassName="overlay"
        contentLabel="Project details"
        appElement={document.getElementById('root')}
      >
        {project && <ProjectDetails project={project} onClose={() => setProject(null)} />}
      </Modal>
    </>
  );
};

export default AppWrap(
  MotionWrap(Work, 'app__works'),
  'work',
  'app__primarybg',
);
