import React from "react";
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import { FaXingSquare } from 'react-icons/fa';

const SocialMedia = () => {
    return (
        <div className="app__social">
            <div>
                <BsLinkedin />
            </div>
            <div>
                <FaXingSquare />
            </div>
            <div>
                <BsGithub />
            </div>
        </div>
    )
}

export default SocialMedia;