import { useState } from 'react';
import { MonthCell } from './MonthCell';
import { EventModal } from './EventModal';
import { useEvents } from '../hooks/useEvents';
import type { CalEvent } from '../types';

interface Props {
  onLogout: () => void;
}

export function YearCalendar({ onLogout }: Props) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [modalState, setModalState] = useState<
    | { mode: 'add'; month: number }
    | { mode: 'edit'; event: CalEvent }
    | null
  >(null);

  const { loading, error, createEvent, updateEvent, deleteEvent, getMonthEvents } = useEvents(year);

  const handleAddClick = (month: number) => setModalState({ mode: 'add', month });
  const handleEventClick = (event: CalEvent) => setModalState({ mode: 'edit', event });

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-slate-100 font-semibold text-lg">YearCal</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setYear(y => y - 1)}
              className="text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-700 transition-colors"
            >
              ←
            </button>
            <span className="text-slate-100 font-semibold w-16 text-center">{year}年</span>
            <button
              onClick={() => setYear(y => y + 1)}
              className="text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-700 transition-colors"
            >
              →
            </button>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          ログアウト
        </button>
      </header>

      <main className="flex-1 p-4">
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            読み込み中...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3" style={{ gridTemplateRows: 'repeat(4, minmax(0, 1fr))' }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <MonthCell
                key={month}
                month={month}
                year={year}
                events={getMonthEvents(month)}
                onAddClick={handleAddClick}
                onEventClick={handleEventClick}
              />
            ))}
          </div>
        )}
      </main>

      {modalState?.mode === 'add' && (
        <EventModal
          initialMonth={modalState.month}
          year={year}
          onSave={async data => { await createEvent(data); }}
          onClose={() => setModalState(null)}
        />
      )}

      {modalState?.mode === 'edit' && (
        <EventModal
          initialMonth={modalState.event.month}
          year={year}
          event={modalState.event}
          onSave={async data => { await updateEvent(modalState.event.id, data); }}
          onDelete={() => deleteEvent(modalState.event.id)}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}
