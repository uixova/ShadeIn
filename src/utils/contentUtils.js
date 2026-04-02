const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * 24 * ONE_HOUR_MS;

const toTimestamp = (value) => {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

export const calculatePopularityScore = (item) => {
  const reactions = item?.reactions || {};
  const reactionsTotal =
    (reactions.heart || 0) +
    (reactions.laugh || 0) +
    (reactions.fire || 0) +
    (reactions.shock || 0) +
    (reactions.sad || 0) +
    (reactions.clap || 0);

  return (item?.views || 0) + reactionsTotal * 3;
};

export const normalizeConfessions = (items) => {
  const now = Date.now();

  return items.map((item, index) => {
    const original = toTimestamp(item.createdAt);
    const isTooOld = !original || now - original > ONE_WEEK_MS;

    if (!isTooOld) return item;

    const offset = (index * 90 * 60 * 1000) % ONE_WEEK_MS;
    return {
      ...item,
      createdAt: new Date(now - offset).toISOString()
    };
  });
};

export const sortByPopularity = (items) => {
  return [...items].sort((a, b) => calculatePopularityScore(b) - calculatePopularityScore(a));
};

