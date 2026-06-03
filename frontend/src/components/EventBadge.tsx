import type { CalEvent } from '../types';

interface Props {
  event: CalEvent;
  onClick: (event: CalEvent) => void;
}

export function EventBadge({ event, onClick }: Props) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(event); }}
      className="flex items-center gap-1.5 w-full text-left px-1 py-0.5 rounded hover:bg-slate-700 transition-colors group"
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: event.color }}
      />
      <span className="text-xs text-slate-300 truncate group-hover:text-slate-100">
        {event.day != null ? `${event.day}日 ` : ''}{event.title}
      </span>
    </button>
  );
}
