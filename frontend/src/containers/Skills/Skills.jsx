import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';

import './Skills.scss';

const Skills = () => {
    const [experience, setExperience] = useState([]);
    const [skills, setSkills] = useState([]);

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
    }, []);

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
                                            <p className='p-text'> {work.company} </p>
                                            <p className='p-text'> {work.desc} </p>
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
    'skills',
    'app__whitebg'
);