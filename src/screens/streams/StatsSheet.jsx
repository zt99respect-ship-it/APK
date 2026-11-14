import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Sheet from '../../components/Sheet.jsx';
import { formatCount } from '../../lib/format.js';

const chartTooltip = {
  contentStyle: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fafafa' },
  labelStyle: { color: '#a1a1aa' },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
};

function StatCard({ label, value }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-xs font-semibold text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-zinc-50">{value}</p>
    </div>
  );
}

function TopChart({ data, dataKey }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={92}
            tick={{ fill: '#d4d4d8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip {...chartTooltip} />
          <Bar dataKey={dataKey} fill="#e4e4e7" radius={[0, 8, 8, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function StatsSheet({ open, onClose, streamers }) {
  const live = streamers.filter((s) => s.isLive);
  const totalViewers = live.reduce((sum, s) => sum + (Number(s.viewers) || 0), 0);
  const averageViewers = live.length ? Math.round(totalViewers / live.length) : 0;
  const totalFollowers = streamers.reduce((sum, s) => sum + (Number(s.followers) || 0), 0);

  const topByViewers = [...streamers]
    .sort((a, b) => (b.viewers || 0) - (a.viewers || 0))
    .slice(0, 5)
    .map((s) => ({ name: s.displayName, viewers: Number(s.viewers) || 0 }));
  const topByFollowers = [...streamers]
    .sort((a, b) => (b.followers || 0) - (a.followers || 0))
    .slice(0, 5)
    .map((s) => ({ name: s.displayName, followers: Number(s.followers) || 0 }));

  return (
    <Sheet open={open} onClose={onClose} title="إحصائيات كيك">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="متوسط المشاهدين" value={formatCount(averageViewers)} />
          <StatCard label="البث المباشر" value={live.length} />
          <StatCard label="إجمالي المتابعين" value={formatCount(totalFollowers)} />
        </div>
        <section>
          <h3 className="mb-3 text-sm font-bold text-zinc-300">أعلى القنوات مشاهدة</h3>
          {topByViewers.length ? <TopChart data={topByViewers} dataKey="viewers" /> : <p className="text-sm text-zinc-500">لا توجد بيانات بعد</p>}
        </section>
        <section>
          <h3 className="mb-3 text-sm font-bold text-zinc-300">أعلى القنوات متابعة</h3>
          {topByFollowers.length ? <TopChart data={topByFollowers} dataKey="followers" /> : <p className="text-sm text-zinc-500">لا توجد بيانات بعد</p>}
        </section>
      </div>
    </Sheet>
  );
}
