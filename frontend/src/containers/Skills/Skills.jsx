import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';

import './Skills.scss';
import ProjectDetails from '../ProjectDetails/ProjectDetails';

const Skills = () => {
    const [experience, setExperience] = useState([]);
    const [skills, setSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [project, setProject] = useState(null);
    const [projectExists, setProjectExists] = useState({});

    useEffect(() => {
        const query = '*[_type == "experiences"]';
        const skillsQuery = '*[_type == "skills"]';

        client.fetch(query).then((data) => {
            // Sort the experience array by year in descending order
            const sortedExperience = data.sort((a, b) => b.year - a.year);
            setExperience(sortedExperience);
        });

        client.fetch(skillsQuery).then((data) => {
            setSkills(data);
        });

        const fetchProjectDetails = async () => {
            const promises = experience.flatMap((exp) => exp.works).map(async (work) => {
                const projectDetailsQuery = `*[_type == "projectDetails" && title == "${work.name}"]`;
                const projectDetails = await client.fetch(projectDetailsQuery);
                return { [work.name]: projectDetails.length > 0 };
            });

            const results = await Promise.all(promises);
            const projectExistsObj = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

            setProjectExists(projectExistsObj);
        };

        fetchProjectDetails();
    }, [experience])

    const handleProjectDetails = async (work) => {
        const projectDetailsQuery = `*[_type == "projectDetails" && title == "${work.name}"]`;
        const projectDetails = await client.fetch(projectDetailsQuery);

        if (projectDetails.length > 0) {
            setProject(projectDetails[0]);
            setIsModalOpen(true);
        }
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <h2 className='head-text'>Skills & Experience</h2>
            <div className='app__skills-container'>
                <motion.div className='app__skills-list'>
                    {skills?.map((skill) => (
                        <motion.div
                            whileInView={{ opacity: [0, 1] }}
                            transition={{ duration: 0.5 }}
                            className="app__skills-item app__flex"
                            key={skill.name}
                        >
                            <div
                                className="app__flex"
                                style={{ backgroundColor: skill.bgColor }}
                            >
                                <img src={urlFor(skill.icon)} alt={skill.name} />
                            </div>
                            <p className="p-text">{skill.name}</p>
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div className='app__skills-exp'>
                    {experience?.map((experience) => (
                        <motion.div
                            className='app__skills-exp-item'
                            key={experience.year}
                        >
                            <div className='app__skills-exp-year'>
                                <p className='bold-text'> {experience.year} </p>
                            </div>
                            <motion.div className='app__skills-exp-works'>
                                {experience.works.map((work) => (
                                    <>
                                        <motion.div
                                            whileInView={{ opacity: [0, 1] }}
                                            transition={{ duration: 0.5 }}
                                            className="app__skills-exp-work skills-tooltip"
                                            data-tip
                                            data-for={work.name}
                                            key={work.name}
                                        >
                                            <h4 className='bold-text'>{work.name}</h4>
                                            <div className="company-logo-container">
                                                <img src={urlFor(work.companyLogo)} alt={work.company} />
                                                <h5> {work.company} </h5>
                                            </div>
                                            <h5>{formatDate(work.startDate)} - {formatDate(work.endDate)}</h5>
                                            <p className='p-text'> {work.desc} </p>
                                            <div className="tag-container">
                                                {work.tags.map((tag) => (
                                                    <div className="tag">
                                                        <p className="tagName" style={{ color: tag.bgColor }}>#{tag.name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            {projectExists[work.name] ? (
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleProjectDetails(work)}
                                                    className="app__work-details app__flex"
                                                >
                                                    More Details
                                                </motion.button>
                                            ) : null}

                                            <Modal
                                                isOpen={isModalOpen}
                                                onRequestClose={() => { setIsModalOpen(false); setProject(null) }}
                                                className="modal"
                                                overlayClassName="overlay"
                                                appElement={document.getElementById('root')}
                                            >
                                                {project && <ProjectDetails project={project} />}
                                            </Modal>
                                        </motion.div>
                                    </>
                                ))}
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </>
    );
}

export default AppWrap(
    MotionWrap(Skills, 'app__skills'),
    'skills & experience',
    'app__whitebg'
);