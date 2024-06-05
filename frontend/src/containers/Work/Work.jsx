import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AiFillEye, AiFillGithub } from 'react-icons/ai';
import { motion } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';

import './Work.scss';
import ProjectDetails from '../ProjectDetails/ProjectDetails';

const Work = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
    const [works, setWorks] = useState([]);
    const [filterWork, setFilterWork] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [project, setProject] = useState(null);

    useEffect(() => {
        const query = '*[_type == "works"]';

        client.fetch(query).then((data) => {
            const sortedWorks = data.sort((a, b) => {
                const startDateA = new Date(a.startDate);
                const startDateB = new Date(b.startDate);
                return startDateB - startDateA;
            });
            setWorks(sortedWorks);
            setFilterWork(sortedWorks);
        });
    }, []);

    const handleProjectDetails = async (work) => {
        const projectDetailsQuery = `*[_type == "projectDetails" && title == "${work.title}"]`;
        const projectDetails = await client.fetch(projectDetailsQuery);

        if (projectDetails.length > 0) {
            setProject(projectDetails[0]);
            setIsModalOpen(true);
        }
    };

    const handleWorkFilter = (item) => {
        setActiveFilter(item);
        setAnimateCard([{ y: 100, opacity: 0 }]);

        setTimeout(() => {
            setAnimateCard([{ y: 0, opacity: 1 }]);
            if (item === 'All') {
                setFilterWork(works);
            } else {
                setFilterWork(works.filter((work) => work.tags.includes(item)));
            }
        }, 500);
    };

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };
    return (
        <>
            <h2 className='head-text'>
                My Creative
                <span> Portfolio</span> Section
            </h2>

            <div className='app__work-filter'>
                {['Full Stack JS', 'DevOps', 'Multiplatform', 'SpringBoot - Angular', 'Microservices Project', 'Laravel Project', 'All'].map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleWorkFilter(item)}
                        className={`app__work-filter-item app__flex p-text ${activeFilter === item ? 'item-active' : ''}`}
                    >
                        {item}
                    </div>
                ))}
            </div>

            <motion.div
                animate={animateCard}
                transition={{ duration: 0.5, delayChildren: 0.5 }}
                className='app__work-portfolio'
            >
                {filterWork.map((work, index) => (
                    <div className='app__work-item app__flex' key={index}>
                        <div className='app__work-img app__flex'>
                            <img src={urlFor(work.imgUrl)} alt={work.name} />
                            <motion.div
                                whileHover={{ opacity: [0, 1] }}
                                transition={{ duration: 0.25, ease: 'easeInOut', staggerChildren: 0.5 }}
                                className='app__work-hover app__flex'
                            >
                                <a href={work.projectLink} target='_blank' rel='noreferrer'>
                                    <motion.div
                                        whileInView={{ scale: [0, 1] }}
                                        whileHover={{ scale: [1, 0.9] }}
                                        transition={{ duration: 0.25 }}
                                        className='app__flex'
                                    >
                                        <AiFillEye />
                                    </motion.div>
                                </a>
                                <a href={work.codeLink} target='_blank' rel='noreferrer'>
                                    <motion.div
                                        whileInView={{ scale: [0, 1] }}
                                        whileHover={{ scale: [1, 0.9] }}
                                        transition={{ duration: 0.25 }}
                                        className='app__flex'
                                    >
                                        <AiFillGithub />
                                    </motion.div>
                                </a>
                            </motion.div>
                        </div>

                        <div className='app__work-content app__flex'>
                            <h4 className='bold-text'>{work.title}</h4>
                            <p className='p-text'>{formatDate(work.startDate)} - {formatDate(work.endDate)}</p>
                            <p className='p-text' style={{ marginTop: 10 }}>{work.description}</p>

                            <div className='app__work-tag app__flex'>
                                <p className='p-text'>{work.tags[0]}</p>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleProjectDetails(work)}
                                className="app__work-details app__flex"
                            >
                                More Details
                            </motion.button>

                            <Modal
                                isOpen={isModalOpen}
                                onRequestClose={() => { setIsModalOpen(false); setProject(null) }}
                                className="modal"
                                overlayClassName="overlay"
                                appElement={document.getElementById('root')}
                            >
                                {project && <ProjectDetails project={project} />}
                            </Modal>

                        </div>

                    </div>
                ))}
            </motion.div>
        </>
    );
}

export default AppWrap(
    MotionWrap(Work, 'app__works'),
    'work',
    'app__primarybg'
);