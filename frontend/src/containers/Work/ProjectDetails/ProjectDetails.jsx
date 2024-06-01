import React, { useEffect, useState } from 'react';
import { urlFor, client } from '../../../client';
import { motion } from 'framer-motion';

import './ProjectDetails.scss';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const ProjectDetails = ({ project }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [member, setMember] = useState('');

    const handleClick = (index) => {
        setCurrentIndex(index);
    }

    useEffect(() => {
        const query = '*[_type == "members" && name == "Khalil Fathalli"][0]';

        client.fetch(query).then((data) => {
            setMember(data);
        });

    }, []);

    return (
        <div>
            <h2 className="app__project-details-title">{project.title}</h2>
            <p className="app__project-details-description">{project.description}</p>
            <div className="app__project-details-section">
                <h3 className="app__project-details-section-title">My Role:</h3>
                <p className="app__project-details-section-content">{project.role}</p>
            </div>
            <div className="app__project-details-section">
                <h3 className="app__project-details-section-title">Technologies:</h3>
                <motion.ul className="app__project-details-section-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    {project.technologies.map((tech, index) => (
                        <motion.li
                            className="app__project-details-section-list-item"
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div
                                className="app__project-details-section-list-item-icon"
                                style={{ backgroundColor: tech.bgColor }}
                            >
                                {tech.icon && (
                                    <img src={urlFor(tech.icon)} alt={tech.name} className="app__project-details-section-list-item-icon-img" />
                                )}
                            </div>
                            <p className="app__project-details-section-list-item-text">{tech.name}</p>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
            <div className="app__project-details-section">
                <h3 className="app__project-details-section-title">Members:</h3>
                <motion.ul className="app__project-details-section-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    {project.members.map((member, index) => (
                        <motion.li
                            className="app__project-details-section-list-item"
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <img
                                src={urlFor(member.photo)}
                                alt={member.name}
                                className="app__project-details-section-list-item-photo"
                            />
                            <div className="app__project-details-section-list-item-info">
                                <p className="app__project-details-section-list-item-info-name">{member.name}</p>
                                <p className="app__project-details-section-list-item-info-role">{member.role}</p>
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
            <div className="app__project-details-section">
                <h3 className="app__project-details-section-title">Results:</h3>
                <p>This section details the functionalities and user experience of the {member.role} module I designed and developed.</p>
                {project.results.length > 0 && (
                    <div className="app__result-container app__flex">
                        <div className="app__result-btns app__flex">
                            <div className="app__flex" onClick={() => handleClick(currentIndex === 0 ? project.results.length - 1 : currentIndex - 1)}>
                                <HiChevronLeft />
                            </div>
                        </div>
                        <motion.div
                            className="app__result-item app__flex"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h4 className="bold-text">{project.results[currentIndex].title}</h4>
                            <img src={urlFor(project.results[currentIndex].results)} alt={project.results[currentIndex].title} />
                            <div className="app__result-content">
                                <div>
                                    <p className="p-text">{project.results[currentIndex].description}</p>
                                </div>
                            </div>
                        </motion.div>
                        <div className="app__result-btns app__flex">
                            <div className="app__flex" onClick={() => handleClick(currentIndex === project.results.length - 1 ? 0 : currentIndex + 1)}>
                                <HiChevronRight />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;