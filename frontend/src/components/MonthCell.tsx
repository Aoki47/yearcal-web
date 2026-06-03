import { useState } from 'react';
import type { CalEvent } from '../types';
import { EventBadge } from './EventBadge';

const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const MAX_VISIBLE = 4;

interface Props {
  month: number;
  year: number;
  events: CalEvent[];
  onAddClick: (month: number) => void;
  onEventClick: (event: CalEvent) => void;
}

export function MonthCell({ month, year, events, onAddClick, onEventClick }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isCurrentMonth = new Date().getFullYear() === year && new Date().getMonth() + 1 === month;

  const sorted = [...events].sort((a, b) => (a.day ?? 0) - (b.day ?? 0));
  const visible = expanded ? sorted : sorted.slice(0, MAX_VISIBLE);
  const hiddenCount = sorted.length - MAX_VISIBLE;

  return (
    <div
      className="bg-slate-800 border border-slate-700 rounded-xl flex flex-col cursor-pointer hover:border-slate-500 transition-colors"
      onClick={() => onAddClick(month)}
    >
      <div className={`px-3 py-2 border-b border-slate-700 flex items-center justify-between ${isCurrentMonth ? 'border-b-cyan-500' : ''}`}>
        <span className={`text-sm font-semibold ${isCurrentMonth ? 'text-cyan-400' : 'text-slate-300'}`}>
          {MONTH_NAMES[month - 1]}
        </span>
        {isCurrentMonth && (
          <span className="text-xs text-cyan-500 bg-cyan-500/10 rounded px-1.5 py-0.5">今月</span>
        )}
      </div>

      <div className="flex-1 p-2 space-y-0.5 min-h-[80px]" onClick={e => e.stopPropagation()}>
        {visible.map(event => (
          <EventBadge key={event.id} event={event} onClick={onEventClick} />
        ))}

        {!expanded && hiddenCount > 0 && (
          <button
            onClick={e => { e.stopPropagation(); setExpanded(true); }}
            className="text-xs text-slate-500 hover:text-slate-300 px-1 py-0.5 transition-colors"
          >
            +{hiddenCount}件
          </button>
        )}

        {expanded && hiddenCount > 0 && (
          <button
            onClick={e => { e.stopPropagation(); setExpanded(false); }}
            className="text-xs text-slate-500 hover:text-slate-300 px-1 py-0.5 transition-colors"
          >
            折りたたむ
          </button>
        )}
      </div>

      <div className="px-2 pb-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onAddClick(month)}
          className="text-xs text-slate-600 hover:text-cyan-400 transition-colors w-full text-left px-1"
        >
          + 予定を追加
        </button>
      </div>
    </div>
  );
}
