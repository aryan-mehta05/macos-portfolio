import clsx from "clsx";
import { Folder } from "lucide-react";

const DEFAULT_NOTES = [
  {
    icon: "①",
    item: "RAG eval → Recall@10 + faithfulness checks",
  },
  {
    icon: "②",
    item: "P95 latency < 250ms (cached embeddings)",
  },
  {
    icon: "③",
    item: "Prompt versioning + regression tests",
  },
  {
    icon: "④",
    item: "Cost-aware model routing (−40% spend)",
  },
  {
    icon: "⑤",
    item: "Tool sandboxing against injection",
  },
]

const Notes = ({
  notes = DEFAULT_NOTES,
  className
}) => {
  return (
    <div
      className={clsx(
        "w-85.5 h-42",
        "rounded-[22px] overflow-hidden",
        "bg-white/65 dark:bg-zinc-900/55",
        "backdrop-blur-xl",
        "border border-white/35 dark:border-white/10",
        "shadow-[0_18px_40px_rgba(0,0,0,0.18)]",
        "ring-1 ring-white/25 dark:ring-white/5",
        className
      )}
      aria-label="Notes widget"
    >
      <div className="text-zinc-900/90 dark:text-white/90 text-[12px] font-semibold flex bg-amber-500 p-1 pl-1.5 items-center justify-between">
        <div className="flex items-center">
          <Folder fill="white" className="w-3 ml-2 mr-1" />
          <p className="font-serif">Notes: AI Engineer Logs</p>
        </div>
        <p className="mr-2 text-zinc-900/70 dark:text-white/70">2/11/26 - 5:24AM</p>
      </div>

      <ul className="m-4 mt-3 text-[12px] text-zinc-900/70 dark:text-white/70">
        {notes.map((note, i) => (
          <li key={i} className="py-0.5">
            {note.icon} {note.item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
