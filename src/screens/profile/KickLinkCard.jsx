import { useState } from 'react';
import { Link2, Unlink } from 'lucide-react';
import { Button } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { kickChannelUrl, normalizeKickSlug } from '../../lib/kick.js';
import { updateUser } from '../../services/users.js';

export default function KickLinkCard() {
  const { authUser, profile, notify } = useApp();
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const linked = profile.kickUsername;

  const save = async (kickUsername) => {
    setSaving(true);
    try {
      await updateUser(authUser.uid, { kickUsername });
      notify(kickUsername ? 'تم ربط حساب كيك' : 'تم فك ربط حساب كيك', 'success');
      setValue('');
    } catch {
      notify('تعذر تحديث حساب كيك', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLink = (e) => {
    e.preventDefault();
    const slug = normalizeKickSlug(value);
    if (!slug) {
      notify('أدخل اسم حسابك على كيك', 'error');
      return;
    }
    save(slug);
  };

  return (
    <section className="glass rounded-3xl p-5">
      <h2 className="text-base font-extrabold text-zinc-50">حساب كيك</h2>
      {linked ? (
        <div className="mt-4 flex flex-col gap-4">
          <a
            href={kickChannelUrl(linked)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-zinc-100 underline-offset-4 hover:underline"
            dir="ltr"
          >
            <Link2 className="h-4 w-4 text-zinc-400" />
            kick.com/{linked}
          </a>
          <Button variant="danger" loading={saving} onClick={() => save('')} className="w-full">
            <Unlink className="h-4 w-4" />
            فك الربط
          </Button>
        </div>
      ) : (
        <form onSubmit={handleLink} className="mt-4 flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-zinc-400">اربط اسم حسابك على كيك ليظهر في ملفك الشخصي.</p>
          <input
            dir="ltr"
            className="field text-start"
            placeholder="kick.com/your-name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit" loading={saving} className="w-full">
            ربط الحساب
          </Button>
        </form>
      )}
    </section>
  );
}
