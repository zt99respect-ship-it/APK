import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopAppBar from '../components/TopAppBar.jsx';
import BottomNav from '../components/BottomNav.jsx';
import AnnouncementBar from '../components/AnnouncementBar.jsx';
import SearchSheet from '../components/SearchSheet.jsx';
import SettingsSheet from '../components/SettingsSheet.jsx';
import { useApp } from '../context/AppContext.jsx';
import StreamsScreen from './StreamsScreen.jsx';
import CommunityScreen from './CommunityScreen.jsx';
import ProfileScreen from './ProfileScreen.jsx';
import AdminPanel from './admin/AdminPanel.jsx';

const SCREENS = {
  streams: StreamsScreen,
  community: CommunityScreen,
  profile: ProfileScreen,
};

export default function MainShell() {
  const { config } = useApp();
  const [tab, setTab] = useState('streams');
  const [adminOpen, setAdminOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const Screen = SCREENS[tab];

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
    setSettingsOpen(false);
  };

  return (
    <div className="mx-auto flex h-dvh max-w-lg flex-col overflow-hidden">
      <TopAppBar onSearch={() => setSearchOpen(true)} onSettings={() => setSettingsOpen(true)} />
      <AnnouncementBar text={config.announcement} />
      <main className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            className="h-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          >
            <Screen onOpenAdmin={() => setAdminOpen(true)} />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav active={tab} onChange={setTab} />

      <AnimatePresence>
        {adminOpen && (
          <motion.div
            key="admin"
            className="fixed inset-0 z-40 mx-auto max-w-lg overflow-y-auto bg-ink"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 320 }}
          >
            <AdminPanel onBack={() => setAdminOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <SearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        installPrompt={installPrompt}
        onInstall={install}
      />
    </div>
  );
}
