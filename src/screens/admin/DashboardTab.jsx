import { useEffect, useState } from 'react';
import { Activity, FileText, Radio, Users } from 'lucide-react';
import { countUsers } from '../../services/users.js';
import { countPosts } from '../../services/posts.js';
import { subscribeGlobalStreamers } from '../../services/streamers.js';
import { useApp } from '../../context/AppContext.jsx';
import { formatCount } from '../../lib/format.js';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-3xl p-5">
      <Icon className="h-5 w-5 text-zinc-400" />
      <p className="mt-4 text-3xl font-extrabold text-zinc-50">{value ?? '…'}</p>
      <p className="mt-1 text-xs font-semibold text-zinc-400">{label}</p>
    </div>
  );
}

export default function DashboardTab() {
  const { notify } = useApp();
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);
  const [streamers, setStreamers] = useState([]);

  useEffect(() => {
    const onError = () => notify('تعذر تحميل الإحصائيات', 'error');
    countUsers().then(setUsers).catch(onError);
    countPosts().then(setPosts).catch(onError);
    return subscribeGlobalStreamers(setStreamers, onError);
  }, [notify]);

  const live = streamers.filter((s) => s.isLive).length;
  const totalViewers = streamers.reduce((sum, s) => sum + (s.isLive ? Number(s.viewers) || 0 : 0), 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard icon={Users} label="إجمالي الأعضاء" value={users !== null ? formatCount(users) : null} />
      <StatCard icon={FileText} label="إجمالي المنشورات" value={posts !== null ? formatCount(posts) : null} />
      <StatCard icon={Radio} label="قنوات مباشرة" value={live} />
      <StatCard icon={Activity} label="مشاهدون الآن" value={formatCount(totalViewers)} />
    </div>
  );
}
