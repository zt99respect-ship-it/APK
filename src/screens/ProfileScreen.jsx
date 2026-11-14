import { useState } from 'react';
import { LogOut, Pencil, ShieldCheck } from 'lucide-react';
import { Avatar, Button, RoleBadge } from '../components/ui.jsx';
import { useApp } from '../context/AppContext.jsx';
import KickLinkCard from './profile/KickLinkCard.jsx';
import EditProfileSheet from './profile/EditProfileSheet.jsx';

export default function ProfileScreen({ onOpenAdmin }) {
  const { profile, isAdmin, signOut } = useApp();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="h-full overflow-y-auto px-4 pb-32 pt-5 no-scrollbar">
        <section className="glass overflow-hidden rounded-3xl">
          <div className="relative h-36 w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950">
            {profile.bannerUrl && <img src={profile.bannerUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          </div>
          <div className="px-5 pb-6">
            <div className="-mt-12 flex items-end justify-between gap-3">
              <div className="rounded-full ring-4 ring-[#09090B]">
                <Avatar src={profile.avatarUrl} name={profile.username} className="h-24 w-24 text-2xl" />
              </div>
              <Button variant="glass" className="h-10 px-4 text-sm" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" />
                تعديل
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-zinc-50">{profile.username}</h1>
              <RoleBadge role={profile.role} />
            </div>
            {profile.bio && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{profile.bio}</p>}
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-5">
          <KickLinkCard />

          {isAdmin && (
            <Button onClick={onOpenAdmin} className="h-14 w-full">
              <ShieldCheck className="h-5 w-5" />
              لوحة الإدارة
            </Button>
          )}

          <Button variant="danger" onClick={signOut} className="h-12 w-full">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
      <EditProfileSheet key={editOpen ? 'open' : 'closed'} open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}
