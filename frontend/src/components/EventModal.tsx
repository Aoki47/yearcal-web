import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { CalEvent, EventFormData } from '../types';
import { COLOR_PRESETS } from '../types';

interface Props {
  initialMonth: number;
  year: number;
  event?: CalEvent;
  onSave: (data: EventFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}

const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export function EventModal({ initialMonth, year, event, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [month, setMonth] = useState(event?.month ?? initialMonth);
  const [day, setDay] = useState<string>(event?.day != null ? String(event.day) : '');
  const [memo, setMemo] = useState(event?.memo ?? '');
  const [color, setColor] = useState(event?.color ?? COLOR_PRESETS[4].value);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('タイトルは必須です'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave({ year, month, day: day ? Number(day) : null, title: title.trim(), memo, color });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !confirm('この予定を削除しますか？')) return;
    setDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch {
      setError('削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h2 className="text-slate-100 font-semibold">
            {event ? '予定を編集' : '予定を追加'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">タイトル <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={50}
              autoFocus
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="例: 花見"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">月</label>
              <select
                value={month}
                onChange={e => setMonth(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={i + 1} value={i + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">日（任意）</label>
              <input
                type="number"
                value={day}
                onChange={e => setDay(e.target.value)}
                min={1}
                max={31}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                placeholder="15"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">メモ（任意）</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              maxLength={200}
              rows={6}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
              placeholder="メモを入力..."
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">色</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setColor(preset.value)}
                  title={preset.label}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${color === preset.value ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: preset.value }}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-2 pt-1">
            {event && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? '削除中...' : '削除'}
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
