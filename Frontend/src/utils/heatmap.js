const DAY_MS = 24 * 60 * 60 * 1000;
export const WEEKS = 53;

const iso = (d) => d.toISOString().slice(0, 10);
const utcMidnight = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

export const levelFor = (count) => {
  if (!count || count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildHeatmap(activity = [], today = new Date()) {
  const counts = new Map();
  for (const a of Array.isArray(activity) ? activity : []) {
    if (a && typeof a.date === "string" && Number(a.count) > 0) counts.set(a.date, Number(a.count));
  }

  const end = utcMidnight(today);
  // Columns are Sunday..Saturday weeks; the last column is the current week
  const lastSunday = new Date(end.getTime() - end.getUTCDay() * DAY_MS);
  const firstSunday = new Date(lastSunday.getTime() - (WEEKS - 1) * 7 * DAY_MS);

  const weeks = [];
  const monthLabels = [];
  let lastMonth = -1;
  let total = 0;
  let activeDays = 0;

  for (let w = 0; w < WEEKS; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(firstSunday.getTime() + (w * 7 + d) * DAY_MS);
      const key = iso(date);
      const future = date.getTime() > end.getTime();
      const count = future ? 0 : counts.get(key) || 0;
      if (!future && count > 0) {
        total += count;
        activeDays += 1;
      }
      week.push({ date: key, count, level: levelFor(count), future });
    }
    weeks.push(week);

    // Label a column with the month when its first day starts a new month
    const month = new Date(firstSunday.getTime() + w * 7 * DAY_MS).getUTCMonth();
    if (month !== lastMonth) {
      monthLabels.push({ week: w, label: MONTHS[month] });
      lastMonth = month;
    }
  }

  return { weeks, monthLabels, total, activeDays, ...streaks(counts, end) };
}

// Current streak counts back from today (or from yesterday if nothing was submitted yet today)
function streaks(counts, end) {
  const has = (date) => counts.has(iso(date));

  let current = 0;
  let cursor = new Date(end.getTime());
  if (!has(cursor)) cursor = new Date(cursor.getTime() - DAY_MS);
  while (has(cursor)) {
    current += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }

  const days = [...counts.keys()].sort();
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const day of days) {
    const t = Date.parse(day);
    run = prev !== null && t - prev === DAY_MS ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = t;
  }

  return { currentStreak: current, longestStreak: longest };
}

export const describeDay = ({ date, count }) => {
  const label = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  });
  return `${count === 0 ? "No submissions" : `${count} submission${count === 1 ? "" : "s"}`} on ${label}`;
};