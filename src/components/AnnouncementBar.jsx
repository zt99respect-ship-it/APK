import { Megaphone } from 'lucide-react';

export default function AnnouncementBar({ text }) {
  if (!text?.trim()) return null;
  return (
    <div className="flex items-center gap-2 border-b border-white/10 bg-brand/15 px-4 py-2 text-sm font-semibold text-zinc-100">
      <Megaphone className="h-4 w-4 shrink-0 text-brand-300" />
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
