/**
 * Date helpers.
 *
 * `formatDate` was copy-pasted into Work, Skills and ProjectDetails. Beyond the
 * duplication, each copy returned an empty string for a missing end date, so an
 * ongoing role rendered as "01/02/2026 – " with nothing after the dash.
 */

/** "2026-02-01" -> "01/02/2026". Returns '' for a missing or malformed value. */
export const formatDate = (dateString) => {
  if (!dateString) return '';

  const [year, month, day] = String(dateString).split('-');
  if (!year || !month || !day) return '';

  return `${day}/${month}/${year}`;
};

/**
 * "01/12/2022 – 30/10/2023", or "01/02/2026 – Present" when there is no end
 * date, which is how a current position is stored in Sanity.
 */
export const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate);
  if (!start) return '';

  const end = formatDate(endDate);
  return `${start} – ${end || 'Present'}`;
};

/** True when a role or project has no end date, i.e. it is still running. */
export const isOngoing = (endDate) => !formatDate(endDate);
