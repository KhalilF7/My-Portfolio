/**
 * "WordPress" -> "W", "Bricks Builder" -> "BB", "Automatic.css" -> "AC".
 *
 * Used wherever a skill or technology has no logo uploaded in Sanity. Initials
 * read as deliberate; an empty circle reads as broken, and a bare
 * src={undefined} renders as a broken-image icon.
 */
export const initialsFor = (name = '') => String(name)
  .split(/[\s._-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0].toUpperCase())
  .join('');
