import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { IconButton } from '../../components/ui.jsx';
import DashboardTab from './DashboardTab.jsx';
import UsersTab from './UsersTab.jsx';
import ModerationTab from './ModerationTab.jsx';
import StreamersTab from './StreamersTab.jsx';
import SettingsTab from './SettingsTab.jsx';

const TABS = [
  { id: 'dashboard', label: 'الرئيسية', Component: DashboardTab },
  { id: 'users', label: 'الأعضاء', Component: UsersTab },
  { id: 'moderation', label: 'المنشورات', Component: ModerationTab },
  { id: 'streamers', label: 'القنوات', Component: StreamersTab },
  { id: 'settings', label: 'الإعدادات', Component: SettingsTab },
];

export default function AdminPanel({ onBack }) {
  const [tab, setTab] = useState('dashboard');
  const Current = TABS.find((t) => t.id === tab).Component;

  return (
    <div className="flex min-h-dvh flex-col pb-10">
      <header className="glass-strong sticky top-0 z-10 flex h-16 items-center gap-3 px-4">
        <IconButton label="رجوع" onClick={onBack}>
          <ArrowRight className="h-5 w-5" />
        </IconButton>
        <h1 className="text-base font-extrabold text-zinc-50">لوحة الإدارة</h1>
      </header>
      <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`h-10 shrink-0 rounded-full px-4 text-sm font-bold transition-colors ${
              tab === t.id ? 'bg-brand text-white' : 'glass text-zinc-300 hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="px-4 pt-5">
        <Current />
      </div>
    </div>
  );
}
