import { useEffect, useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Avatar, Button, LiveBadge } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { fetchKickChannel, normalizeKickSlug } from '../../lib/kick.js';
import { formatCount } from '../../lib/format.js';
import {
  deleteGlobalStreamer,
  refreshGlobalStreamer,
  saveGlobalStreamer,
  subscribeGlobalStreamers,
} from '../../services/streamers.js';

export default function StreamersTab() {
  const { notify } = useApp();
  const [streamers, setStreamers] = useState(null);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => subscribeGlobalStreamers(setStreamers, () => notify('تعذر تحميل القنوات', 'error')), [notify]);

  const addStreamer = async (e) => {
    e.preventDefault();
    const slug = normalizeKickSlug(value);
    if (!slug) return;
    setBusy('add');
    try {
      const channel = await fetchKickChannel(slug);
      if (!channel) {
        notify('تعذر جلب بيانات القناة من كيك. تحقق من الاسم', 'error');
        return;
      }
      await saveGlobalStreamer(channel);
      setValue('');
      notify('تمت إضافة القناة', 'success');
    } catch {
      notify('تعذر حفظ القناة', 'error');
    } finally {
      setBusy('');
    }
  };

  const refresh = async (streamer) => {
    setBusy(streamer.id);
    try {
      const channel = await fetchKickChannel(streamer.id);
      if (!channel) {
        notify('تعذر جلب بيانات القناة من كيك', 'error');
        return;
      }
      await refreshGlobalStreamer(streamer.id, channel);
      notify('تم تحديث القناة', 'success');
    } catch {
      notify('تعذر تحديث القناة', 'error');
    } finally {
      setBusy('');
    }
  };

  const remove = async (streamer) => {
    if (!window.confirm(`حذف ${streamer.displayName} من القنوات العامة؟`)) return;
    setBusy(streamer.id);
    try {
      await deleteGlobalStreamer(streamer.id);
      notify('تم حذف القناة', 'success');
    } catch {
      notify('تعذر حذف القناة', 'error');
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={addStreamer} className="glass flex flex-col gap-3 rounded-3xl p-4">
        <p className="text-sm font-bold text-zinc-200">إضافة قناة عامة</p>
        <input
          dir="ltr"
          className="field text-start"
          placeholder="kick.com/channel-name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <Button type="submit" loading={busy === 'add'} className="w-full">
          جلب البيانات وحفظ
        </Button>
      </form>

      {streamers === null && <div className="glass h-24 animate-pulse rounded-3xl" />}
      {streamers?.length === 0 && <p className="py-8 text-center text-sm text-zinc-500">لم تُضف أي قناة بعد</p>}
      {streamers?.map((s) => (
        <div key={s.id} className="glass flex items-center gap-3 rounded-3xl p-3">
          <Avatar src={s.avatarUrl} name={s.displayName} className="h-11 w-11" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-zinc-50">{s.displayName}</p>
              {s.isLive && <LiveBadge />}
            </div>
            <p className="truncate text-xs text-zinc-500">{formatCount(s.followers)} متابع</p>
          </div>
          <button
            type="button"
            aria-label="تحديث البيانات"
            disabled={busy === s.id}
            onClick={() => refresh(s)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10 disabled:opacity-40"
          >
            <RefreshCw className={`h-4 w-4 ${busy === s.id ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            aria-label="حذف القناة"
            disabled={busy === s.id}
            onClick={() => remove(s)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-rose-300 hover:bg-danger/15 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
