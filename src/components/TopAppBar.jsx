import { Search, Settings } from 'lucide-react';
import { IconButton } from './ui.jsx';

const LOGO_SRC = '/Picsart_26-11-14_11-07-40-109.jpg';

export default function TopAppBar({ onSearch, onSettings }) {
  return (
    <header className="glass-strong sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <img src={LOGO_SRC} alt="RESPECT" className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10" />
        <span className="text-base font-extrabold tracking-wide text-zinc-50">RESPECT</span>
      </div>
      <div className="flex items-center gap-1">
        <IconButton label="بحث" onClick={onSearch}>
          <Search className="h-5 w-5" />
        </IconButton>
        <IconButton label="الإعدادات" onClick={onSettings}>
          <Settings className="h-5 w-5" />
        </IconButton>
      </div>
    </header>
  );
}
