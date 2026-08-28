import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Read-only client. No token is used here on purpose: anything passed to a
// REACT_APP_* variable is compiled into the public JS bundle. Writes (the
// contact form) go through the Netlify function in netlify/functions/contact.js,
// which keeps the write token on the server.
export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2022-12-11',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

/**
 * Build a CDN-optimised image URL.
 * Sanity serves the original file unless we ask for a transform, so without
 * this we were shipping 2500px originals into 200px slots.
 *
 * @param {object} source  Sanity image reference
 * @param {number} width   Rendered width in CSS pixels (2x is requested for retina)
 * @param {number} quality JPEG/WebP quality, 1-100
 */
export const imageUrl = (source, width = 600, quality = 75) => {
  if (!source) return undefined;
  return builder
    .image(source)
    .width(width * 2)
    .quality(quality)
    .auto('format')
    .fit('max')
    .url();
};
