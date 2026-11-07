import { useEffect, useMemo, useRef } from "react";
import { buildHeatmap, describeDay } from "../utils/heatmap";

// empty -> busiest, using the site's gold
const LEVEL_COLORS = [
  "#26221d",
  "rgba(255, 215, 0, 0.28)",
  "rgba(255, 215, 0, 0.5)",
  "rgba(255, 215, 0, 0.75)",
  "#ffd700",
];

const CELL = 12;
const GAP = 3;

function ActivityHeatmap({ activity }) {
  const { weeks, monthLabels, total, activeDays, currentStreak, longestStreak } = useMemo(
    () => buildHeatmap(activity),
    [activity]
  );
  const scroller = useRef(null);

  // On narrow screens start at the right edge, where "today" is
  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, []);

  const gridWidth = weeks.length * CELL + (weeks.length - 1) * GAP;

  return (
    <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-4 sm:p-5 mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-4">
        <h2 className="text-lg font-bold text-base-content">
          {total} submission{total === 1 ? "" : "s"}
          <span className="text-base-content/50 font-medium text-sm"> in the last year</span>
        </h2>
        <div className="flex gap-4 text-xs text-base-content/60 font-medium">
          <span>Active days: <span className="text-base-content">{activeDays}</span></span>
          <span>Current streak: <span className="text-base-content">{currentStreak}</span></span>
          <span>Longest streak: <span className="text-base-content">{longestStreak}</span></span>
        </div>
      </div>

      <div ref={scroller} className="overflow-x-auto pb-2">
        <div
          role="img"
          aria-label={`Activity: ${total} submissions on ${activeDays} days in the last year, current streak ${currentStreak} days`}
          style={{ width: gridWidth }}
        >
          <div className="relative h-4 mb-1 text-[10px] text-base-content/50">
            {monthLabels.map(({ week, label }) => (
              <span key={`${week}-${label}`} className="absolute" style={{ left: week * (CELL + GAP) }}>
                {label}
              </span>
            ))}
          </div>

          <div
            data-testid="heatmap-grid"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(7, ${CELL}px)`,
              gridAutoFlow: "column",
              gridAutoColumns: `${CELL}px`,
              gap: `${GAP}px`,
            }}
          >
            {weeks.flat().map((cell) => (
              <div
                key={cell.date}
                title={cell.future ? undefined : describeDay(cell)}
                data-level={cell.future ? "future" : cell.level}
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 3,
                  backgroundColor: cell.future ? "transparent" : LEVEL_COLORS[cell.level],
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-base-content/50">
        <span>Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <span key={i} style={{ width: CELL, height: CELL, borderRadius: 3, backgroundColor: color, display: "inline-block" }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default ActivityHeatmap;