import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import { imageUrl, client } from '../../client';
import { formatDateRange } from '../../utils';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import './Skills.scss';

const Skills = () => {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [project, setProject] = useState(null);
  const [detailTitles, setDetailTitles] = useState(new Set());

  useEffect(() => {
    // This effect previously listed `experiences` as a dependency while also
    // calling setExperiences inside it. Each fetch returned a fresh array, so
    // the reference always changed and the effect re-ran forever — the live
    // site was firing hundreds of Sanity requests per visit. It now runs once.
    let cancelled = false;

    const load = async () => {
      try {
        const [experienceData, skillsData, detailTitleList] = await Promise.all([
          client.fetch('*[_type == "experiences"] | order(year desc)'),
          client.fetch('*[_type == "skills"] | order(name asc)'),
          // One query for every title that has details, instead of one request
          // per work item.
          client.fetch('*[_type == "projectDetails"].title'),
        ]);

        if (cancelled) return;
        setExperiences(experienceData);
        setSkills(skillsData);
        setDetailTitles(new Set(detailTitleList));
      } catch (err) {
        console.error('Failed to load skills and experience:', err);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

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
        Skills & <span>Experience</span>
      </h2>

      <p className="section-subtitle">
        Five years of internships and professional web development across the
        JavaScript, Java, PHP and Python ecosystems.
      </p>

      <div className="app__skills-container">
        <motion.div className="app__skills-list">
          {skills.map((skill) => (
            <motion.div
              whileInView={{ opacity: [0, 1] }}
              transition={{ duration: 0.5 }}
              className="app__skills-item app__flex"
              key={skill._id || skill.name}
            >
              <div className="app__flex" style={{ backgroundColor: skill.bgColor }}>
                <img src={imageUrl(skill.icon, 60)} alt={skill.name} loading="lazy" />
              </div>
              <p className="p-text">{skill.name}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="app__skills-exp">
          {experiences.map((experience) => (
            <motion.div className="app__skills-exp-item" key={experience._id || experience.year}>
              <div className="app__skills-exp-year">
                <p className="bold-text">{experience.year}</p>
              </div>

              <motion.div className="app__skills-exp-works">
                {(experience.works || []).map((work) => (
                  <motion.div
                    whileInView={{ opacity: [0, 1] }}
                    transition={{ duration: 0.5 }}
                    className="app__skills-exp-work"
                    key={work._key || work.name}
                  >
                    <h3 className="bold-text">{work.name}</h3>

                    <div className="company-logo-container">
                      {work.companyLogo && (
                        <img
                          src={imageUrl(work.companyLogo, 40)}
                          alt={`${work.company} logo`}
                          loading="lazy"
                        />
                      )}
                      <p className="company-name">{work.company}</p>
                    </div>

                    <p className="work-dates">
                      {formatDateRange(work.startDate, work.endDate)}
                    </p>

                    <p className="p-text">{work.desc}</p>

                    <div className="tag-container">
                      {(work.tags || []).map((tag) => (
                        <div className="tag" key={tag._key || tag.name}>
                          <p className="tagName" style={{ color: tag.bgColor }}>#{tag.name}</p>
                        </div>
                      ))}
                    </div>

                    {detailTitles.has(work.name) && (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openDetails(work.name)}
                        className="app__work-details app__flex"
                      >
                        More Details
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/*
        One modal for the whole section. It used to be rendered inside the map,
        so opening it mounted a separate modal for every single work item.
      */}
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
  MotionWrap(Skills, 'app__skills'),
  'skills',
  'app__whitebg',
);
