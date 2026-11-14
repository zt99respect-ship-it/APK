import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Sheet from './Sheet.jsx';
import { Avatar, RoleBadge } from './ui.jsx';
import { kickChannelUrl } from '../lib/kick.js';
import { searchUsers } from '../services/users.js';
import { fetchGlobalStreamers } from '../services/streamers.js';
import { useApp } from '../context/AppContext.jsx';

export default function SearchSheet({ open, onClose }) {
  const { notify } = useApp();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState({ users: [], streamers: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = term.trim().toLowerCase();
    if (!q) {
      setResults({ users: [], streamers: [] });
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [users, streamers] = await Promise.all([searchUsers(q), fetchGlobalStreamers()]);
        if (cancelled) return;
        const matchedStreamers = streamers.filter(
          (s) => s.displayName?.toLowerCase().includes(q) || s.slug?.includes(q),
        );
        setResults({ users, streamers: matchedStreamers });
      } catch {
        if (!cancelled) notify('تعذر تنفيذ البحث', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term, notify]);

  const empty = term.trim() && !loading && !results.users.length && !results.streamers.length;

  return (
    <Sheet open={open} onClose={onClose} title="بحث">
      <div className="flex flex-col gap-5">
        <label className="relative block">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            autoFocus
            className="field ps-12"
            placeholder="ابحث عن قناة أو عضو"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </label>

        {results.streamers.length > 0 && (
          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-zinc-400">القنوات</h3>
            {results.streamers.map((s) => (
              <a
                key={s.id}
                href={kickChannelUrl(s.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex items-center gap-3 rounded-2xl p-3"
              >
                <Avatar src={s.avatarUrl} name={s.displayName} className="h-10 w-10" />
                <span className="truncate text-sm font-bold text-zinc-50">{s.displayName}</span>
              </a>
            ))}
          </section>
        )}

        {results.users.length > 0 && (
          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-zinc-400">الأعضاء</h3>
            {results.users.map((u) => (
              <div key={u.id} className="glass flex items-center gap-3 rounded-2xl p-3">
                <Avatar src={u.avatarUrl} name={u.username} className="h-10 w-10" />
                <span className="truncate text-sm font-bold text-zinc-50">{u.username}</span>
                <RoleBadge role={u.role} />
              </div>
            ))}
          </section>
        )}

        {empty && <p className="py-6 text-center text-sm text-zinc-500">لا توجد نتائج مطابقة</p>}
      </div>
    </Sheet>
  );
}
