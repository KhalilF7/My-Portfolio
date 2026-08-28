/**
 * Contact form endpoint.
 *
 * The browser used to call client.create() directly, which meant shipping a
 * Sanity write token in the JS bundle where anyone could read it. This runs on
 * Netlify's servers instead: the token lives in SANITY_WRITE_TOKEN (no
 * REACT_APP_ prefix, so CRA never inlines it) and never reaches the client.
 *
 * It calls Sanity's HTTP mutate API with the built-in fetch rather than using
 * @sanity/client, so the function has no dependencies to install or bundle.
 */

const API_VERSION = '2022-12-11';

const MAX = { name: 100, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return json(400, { error: 'Invalid JSON body' });
  }

  // Honeypot: a hidden field real users never fill in, but bots do. Return 200
  // so the bot believes it succeeded and does not retry.
  if (payload.company) return json(200, { ok: true });

  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const message = String(payload.message || '').trim();

  if (!name || !email || !message) {
    return json(400, { error: 'Name, email and message are all required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return json(400, { error: 'Please enter a valid email address.' });
  }
  if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
    return json(400, { error: 'One of the fields is too long.' });
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';

  if (!token || !projectId) {
    console.error('Missing SANITY_WRITE_TOKEN or SANITY_PROJECT_ID environment variable.');
    return json(500, { error: 'The contact form is not configured correctly.' });
  }

  const url = `https://${projectId}.api.sanity.io/v${API_VERSION}/data/mutate/${dataset}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mutations: [
          {
            create: {
              _type: 'contact',
              name,
              email,
              message,
              // Useful in the Studio; the schema ignores unknown fields safely.
              submittedAt: new Date().toISOString(),
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(`Sanity mutate failed (${response.status}): ${detail.slice(0, 300)}`);
      return json(502, { error: 'Could not send your message. Please try again.' });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error('Failed to save contact submission:', err.message);
    return json(502, { error: 'Could not send your message. Please try again.' });
  }
};
