/**
 * Single source of truth for the page sections.
 *
 * Previously the nav, the navigation dots and each container's AppWrap call all
 * repeated the same list of strings by hand. The label was used as the anchor
 * id too, which produced `href="#skills & experience"` — an id containing a
 * space and an ampersand. Splitting `id` from `label` fixes the anchor and means
 * a section can be renamed in one place.
 */
const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills & Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export default SECTIONS;
