import React, { useState } from 'react';

import { images } from '../../constants';
import { AppWrap, MotionWrap } from '../../wrapper';
import './Footer.scss';

const EMPTY_FORM = { name: '', email: '', message: '', company: '' };

const Footer = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { name, email, message, company } = formData;

  const handleChangeInput = (e) => {
    const { name: field, value } = e.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Posts to the Netlify function, which holds the Sanity write token
      // server-side. This used to call client.create() straight from the
      // browser, which required shipping that token in the JS bundle.
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong. Please try again.');
      }

      setIsFormSubmitted(true);
      setFormData(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="head-text">
        Take a coffee & <span>chat with me</span>
      </h2>

      <p className="section-subtitle">
        Open to software engineering and full stack developer roles. Send a message
        and I will reply as soon as I can.
      </p>

      <div className="app__footer-cards">
        <a href="mailto:fathaallikhalil@gmail.com" className="app__footer-card">
          <img src={images.email} alt="" aria-hidden="true" />
          <span className="p-text">fathaallikhalil@gmail.com</span>
        </a>
        <a
          href="https://api.whatsapp.com/send?phone=0021690666515"
          className="app__footer-card"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img src={images.mobile} alt="" aria-hidden="true" />
          <span className="p-text">+216 90 666 515</span>
        </a>
      </div>

      {!isFormSubmitted ? (
        <form className="app__footer-form app__flex" onSubmit={handleSubmit} noValidate>
          <div className="app__flex">
            <label className="sr-only" htmlFor="contact-name">Your name</label>
            <input
              id="contact-name"
              className="p-text"
              type="text"
              placeholder="Your Name"
              name="name"
              value={name}
              onChange={handleChangeInput}
              autoComplete="name"
              required
            />
          </div>

          <div className="app__flex">
            <label className="sr-only" htmlFor="contact-email">Your email</label>
            <input
              id="contact-email"
              className="p-text"
              type="email"
              placeholder="Your Email"
              name="email"
              value={email}
              onChange={handleChangeInput}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="contact-message">Your message</label>
            <textarea
              id="contact-message"
              className="p-text"
              placeholder="Your Message"
              name="message"
              value={message}
              onChange={handleChangeInput}
              rows="6"
              required
            />
          </div>

          {/* Honeypot: hidden from people, filled in by bots. */}
          <div className="app__footer-honeypot" aria-hidden="true">
            <label htmlFor="contact-company">Company</label>
            <input
              id="contact-company"
              type="text"
              name="company"
              value={company}
              onChange={handleChangeInput}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>

          {error && <p className="app__footer-error" role="alert">{error}</p>}

          <button type="submit" className="p-text" disabled={loading}>
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      ) : (
        <div className="app__footer-success" role="status">
          <h3 className="head-text">Thank you for getting in touch!</h3>
          <p className="p-text">I will get back to you as soon as I can.</p>
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Footer, 'app__footer'),
  'contact',
  'app__whitebg',
);
