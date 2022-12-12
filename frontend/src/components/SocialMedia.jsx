import React from "react";
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import { FaXingSquare } from 'react-icons/fa';

const SocialMedia = () => {
    return (
        <div className="app__social">
            <a href="https://www.linkedin.com/in/khalil-fathalli-481594201/">
                <div>
                    <BsLinkedin />
                </div>
            </a>
            <a href="https://www.xing.com/profile/Khalil_Fathalli">
                <div>
                    <FaXingSquare />
                </div>
            </a>
            <a href="https://github.com/KhalilF7">
                <div>
                    <BsGithub />
                </div>
            </a>
        </div>
    )
}

export default SocialMedia;