import { useEffect, useMemo, useState } from 'react';
import { Ban, Search, ShieldPlus, ShieldMinus, VolumeX, Volume2 } from 'lucide-react';
import { Avatar, Button, RoleBadge } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { listUsers, updateUser } from '../../services/users.js';

function UserRow({ user, busy, onPatch }) {
  return (
    <div className="glass flex flex-col gap-3 rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <Avatar src={user.avatarUrl} name={user.username} className="h-11 w-11" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-bold text-zinc-50">{user.username}</p>
            <RoleBadge role={user.role} />
            {user.banned && <span className="rounded-full bg-danger/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">محظور</span>}
            {user.muted && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-300">مكتوم</span>}
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-500" dir="ltr">{user.id}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="glass" className="h-10 text-xs" loading={busy} onClick={() => onPatch(user, { banned: !user.banned })}>
          <Ban className="h-4 w-4" />
          {user.banned ? 'رفع الحظر' : 'حظر'}
        </Button>
        <Button variant="glass" className="h-10 text-xs" loading={busy} onClick={() => onPatch(user, { muted: !user.muted })}>
          {user.muted ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {user.muted ? 'رفع الكتم' : 'كتم'}
        </Button>
        {user.role !== 'admin' && (
          <Button
            variant="glass"
            className="col-span-2 h-10 text-xs"
            loading={busy}
            onClick={() => onPatch(user, { role: user.role === 'moderator' ? 'user' : 'moderator' })}
          >
            {user.role === 'moderator' ? <ShieldMinus className="h-4 w-4" /> : <ShieldPlus className="h-4 w-4" />}
            {user.role === 'moderator' ? 'إلغاء الإشراف' : 'ترقية إلى مشرف'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function UsersTab() {
  const { notify } = useApp();
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = () =>
    listUsers(100)
      .then(setUsers)
      .catch(() => notify('تعذر تحميل الأعضاء', 'error'));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!users) return [];
    return q ? users.filter((u) => u.username?.toLowerCase().includes(q)) : users;
  }, [users, query]);

  const patch = async (user, change) => {
    setBusyId(user.id);
    try {
      await updateUser(user.id, change);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...change } : u)));
      notify('تم تحديث العضو', 'success');
    } catch {
      notify('تعذر تحديث العضو', 'error');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="relative block">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
        <input className="field ps-12" placeholder="ابحث باسم المستخدم" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      {users === null && <div className="glass h-24 animate-pulse rounded-3xl" />}
      {users && filtered.length === 0 && <p className="py-8 text-center text-sm text-zinc-500">لا يوجد أعضاء مطابقون</p>}
      {filtered.map((u) => (
        <UserRow key={u.id} user={u} busy={busyId === u.id} onPatch={patch} />
      ))}
    </div>
  );
}
