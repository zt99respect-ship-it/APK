import { Bell, BellRing, Trash2 } from 'lucide-react';
import { Avatar, IconButton, LiveBadge } from '../../components/ui.jsx';
import { formatCount } from '../../lib/format.js';

export default function StreamerRow({ streamer, onOpen, bellOn, onToggleBell, onDelete }) {
  const subtitle = streamer.isLive
    ? `${formatCount(streamer.viewers)} مشاهد${streamer.category ? ` · ${streamer.category}` : ''}`
    : `${formatCount(streamer.followers)} متابع`;

  return (
    <div className="glass flex items-center gap-2 rounded-3xl p-3 transition-colors hover:bg-white/[0.07]">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-start">
        <Avatar src={streamer.avatarUrl} name={streamer.displayName} className="h-12 w-12" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-zinc-50">{streamer.displayName}</p>
            {streamer.isLive && <LiveBadge />}
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-400">{subtitle}</p>
        </div>
      </button>
      {onToggleBell && (
        <IconButton
          label={bellOn ? 'إلغاء التنبيه' : 'تفعيل التنبيه'}
          onClick={onToggleBell}
          className={bellOn ? 'bg-brand/15 text-brand-300' : ''}
        >
          {bellOn ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </IconButton>
      )}
      {onDelete && (
        <IconButton label="حذف القناة" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      )}
    </div>
  );
}
