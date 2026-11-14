import { Download, LogOut } from 'lucide-react';
import Sheet from './Sheet.jsx';
import { Button } from './ui.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function SettingsSheet({ open, onClose, installPrompt, onInstall }) {
  const { profile, signOut } = useApp();

  return (
    <Sheet open={open} onClose={onClose} title="الإعدادات">
      <div className="flex flex-col gap-4">
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-zinc-400">الحساب</p>
          <p className="mt-1 text-sm font-bold text-zinc-50">{profile?.username}</p>
        </div>
        {installPrompt && (
          <Button variant="glass" onClick={onInstall} className="w-full">
            <Download className="h-4 w-4" />
            تثبيت التطبيق على الجهاز
          </Button>
        )}
        <Button variant="danger" onClick={signOut} className="w-full">
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </Sheet>
  );
}
