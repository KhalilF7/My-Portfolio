import React from 'react';
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import { FaXingSquare } from 'react-icons/fa';

const PROFILES = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/khalil-fathalli/', Icon: BsLinkedin },
  { label: 'Xing', href: 'https://www.xing.com/profile/Khalil_Fathalli', Icon: FaXingSquare },
  { label: 'GitHub', href: 'https://github.com/KhalilF7', Icon: BsGithub },
];

const SocialMedia = () => (
  <div className="app__social">
    {PROFILES.map(({ label, href, Icon }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${label} profile (opens in a new tab)`}
      >
        <div>
          <Icon aria-hidden="true" />
        </div>
      </a>
    ))}
  </div>
);

export default SocialMedia;
