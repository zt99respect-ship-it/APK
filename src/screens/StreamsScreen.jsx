import { useEffect, useState } from 'react';
import { Plus, BarChart3 } from 'lucide-react';
import { Avatar, Button, LiveBadge } from '../components/ui.jsx';
import { formatCount } from '../lib/format.js';
import { fetchKickChannel } from '../lib/kick.js';
import { useApp } from '../context/AppContext.jsx';
import {
  deletePrivateStreamer,
  refreshPrivateStreamer,
  setBell,
  subscribeBells,
  subscribeGlobalStreamers,
  subscribePrivateStreamers,
} from '../services/streamers.js';
import StreamerRow from './streams/StreamerRow.jsx';
import PlayerSheet from './streams/PlayerSheet.jsx';
import AddPrivateStreamerSheet from './streams/AddPrivateStreamerSheet.jsx';
import StatsSheet from './streams/StatsSheet.jsx';
import PullToRefresh from '../components/PullToRefresh.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function StreamsScreen() {
  const { authUser, notify } = useApp();
  const uid = authUser.uid;
  const [globalStreamers, setGlobalStreamers] = useState(null);
  const [privateStreamers, setPrivateStreamers] = useState(null);
  const [bellSet, setBellSet] = useState(() => new Set());
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  useEffect(() => {
    const onError = () => notify('تعذر تحميل البثوث', 'error');
    const unsubs = [
      subscribeGlobalStreamers(setGlobalStreamers, onError),
      subscribePrivateStreamers(uid, setPrivateStreamers, onError),
      subscribeBells(uid, setBellSet, onError),
    ];
    return () => unsubs.forEach((u) => u());
  }, [uid, notify]);

  const liveNow = (globalStreamers || []).filter((s) => s.isLive);

  const toggleBell = async (streamer) => {
    const enabled = !bellSet.has(streamer.id);
    try {
      await setBell(uid, streamer.id, enabled);
      notify(enabled ? 'سنخبرك عندما يبدأ البث' : 'تم إلغاء التنبيه', 'success');
    } catch {
      notify('تعذر تحديث التنبيه', 'error');
    }
  };

  const removePrivate = async (slug) => {
    try {
      await deletePrivateStreamer(uid, slug);
      notify('تم حذف القناة', 'success');
    } catch {
      notify('تعذر حذف القناة', 'error');
    }
  };

  const refreshPrivate = async () => {
    if (!privateStreamers?.length) return;
    const results = await Promise.all(
      privateStreamers.map(async (s) => {
        const data = await fetchKickChannel(s.slug);
        if (!data) return false;
        await refreshPrivateStreamer(uid, s.slug, data);
        return true;
      }),
    );
    const allOk = results.every(Boolean);
    notify(allOk ? 'تم تحديث القنوات' : 'تعذر تحديث بعض القنوات', allOk ? 'success' : 'error');
  };

  return (
    <>
      <PullToRefresh onRefresh={refreshPrivate} className="px-4 pb-32 pt-5">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-50">البثوث</h1>
            <p className="mt-1 text-sm text-zinc-400">شاهد القنوات المباشرة من مجتمع ريسبكت</p>
          </div>
          <Button variant="glass" className="h-11 px-4" onClick={() => setStatsOpen(true)}>
            <BarChart3 className="h-4 w-4 text-brand-300" />
            الإحصائيات
          </Button>
        </div>

        {liveNow.length > 0 && (
          <section className="mb-7">
            <h2 className="mb-3 text-sm font-bold text-zinc-300">مباشر الآن</h2>
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
              {liveNow.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelected(s)}
                  className="glass w-40 shrink-0 rounded-3xl p-3 text-start transition-transform active:scale-[0.97]"
                >
                  <div className="flex items-center justify-between">
                    <Avatar src={s.avatarUrl} name={s.displayName} className="h-12 w-12" />
                    <LiveBadge />
                  </div>
                  <p className="mt-3 truncate text-sm font-bold text-zinc-50">{s.displayName}</p>
                  <p className="mt-1 text-xs text-zinc-400">{formatCount(s.viewers)} مشاهد</p>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mb-7">
          <h2 className="mb-3 text-sm font-bold text-zinc-300">قنوات المجتمع</h2>
          {globalStreamers === null && <div className="glass h-24 animate-pulse rounded-3xl" />}
          {globalStreamers?.length === 0 && (
            <EmptyState title="لا توجد قنوات بعد" description="ستظهر هنا القنوات التي يضيفها فريق ريسبكت." />
          )}
          <div className="flex flex-col gap-3">
            {globalStreamers?.map((s) => (
              <StreamerRow
                key={s.id}
                streamer={s}
                onOpen={() => setSelected(s)}
                bellOn={bellSet.has(s.id)}
                onToggleBell={() => toggleBell(s)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-300">قنواتي الخاصة</h2>
            <Button variant="glass" className="h-9 px-3 text-xs" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              إضافة قناة
            </Button>
          </div>
          {privateStreamers?.length === 0 && (
            <EmptyState
              title="أضف قنواتك المفضلة"
              description="القنوات الخاصة تظهر لك وحدك. أضف اسم القناة من كيك."
            />
          )}
          <div className="flex flex-col gap-3">
            {privateStreamers?.map((s) => (
              <StreamerRow
                key={s.id}
                streamer={s}
                onOpen={() => setSelected(s)}
                onDelete={() => removePrivate(s.id)}
              />
            ))}
          </div>
        </section>
      </PullToRefresh>

      <PlayerSheet streamer={selected} onClose={() => setSelected(null)} />
      <AddPrivateStreamerSheet open={addOpen} onClose={() => setAddOpen(false)} />
      <StatsSheet open={statsOpen} onClose={() => setStatsOpen(false)} streamers={globalStreamers || []} />
    </>
  );
}
