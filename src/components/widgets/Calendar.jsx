import clsx from "clsx";
import dayjs from "dayjs";
import { useMemo } from "react";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(localeData);

// Generates a 6-row month grid (42 cells)
const buildMonthGrid = (viewDate) => {
  const startOfMonth = viewDate.startOf("month");

  // dayjs().day(): 0=Sunday ... 6=Saturday
  const startDow = startOfMonth.day();

  // Grid starts on Sunday (common mini-calendar layout)
  const gridStart = startOfMonth.subtract(startDow, "day");

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = gridStart.add(i, "day");
    cells.push({
      date: d,
      inMonth: d.month() === viewDate.month(),
      isToday: d.isSame(dayjs(), "day"),
    });
  }
  return { cells };
};

const Calendar = ({ value, className }) => {
  const viewDate = useMemo(() => (value ? dayjs(value) : dayjs()), [value]);
  const { cells } = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const monthLabel = viewDate.format("MMMM");
  const yearLabel = viewDate.format("YYYY");
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div
      className={clsx(
        "w-42 h-42",
        "rounded-[22px] p-3 overflow-hidden",
        "bg-white/65 dark:bg-zinc-900/55",
        "backdrop-blur-xl",
        "border border-white/35 dark:border-white/10",
        "shadow-[0_18px_40px_rgba(0,0,0,0.18)]",
        "ring-1 ring-white/25 dark:ring-white/5",
        className
      )}
      aria-label="Calendar widget"
    >
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div className="flex flex-col leading-none">
          <span className="text-[12px] font-semibold text-zinc-900/90 dark:text-white/90">
            {monthLabel}
          </span>
          <span className="mt-0.5 text-[11px] font-medium text-zinc-700/70 dark:text-white/60">
            {yearLabel}
          </span>
        </div>

        <div className="h-1.5 w-1.5 rounded-full bg-zinc-900/15 dark:bg-white/15" />
      </div>

      {/* Weekdays */}
      <div className="mt-2 grid grid-cols-7 gap-x-1.5">
        {weekdays.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-semibold text-zinc-700/55 dark:text-white/45"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="mt-1.5 grid grid-cols-7 gap-x-1.5 gap-y-1.5">
        {cells.map(({ date, inMonth, isToday }, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
          >
            <div
              className={clsx(
                "flex h-4.5 w-4.5 items-center justify-center rounded-full",
                "text-[11px] font-semibold",
                inMonth
                  ? "text-zinc-900/85 dark:text-white/85"
                  : "text-zinc-500/35 dark:text-white/25",
                isToday &&
                  "bg-[#ff3b30] text-white shadow-[0_6px_14px_rgba(255,59,48,0.35)]"
              )}
            >
              {date.date()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
