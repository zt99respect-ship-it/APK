import { useState } from 'react';
import Sheet from '../../components/Sheet.jsx';
import { Button } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { fetchKickChannel, normalizeKickSlug } from '../../lib/kick.js';
import { savePrivateStreamer } from '../../services/streamers.js';

export default function AddPrivateStreamerSheet({ open, onClose }) {
  const { authUser, notify } = useApp();
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = normalizeKickSlug(value);
    if (!slug) {
      notify('أدخل اسم القناة أو رابطها', 'error');
      return;
    }
    setSaving(true);
    try {
      const fetched = await fetchKickChannel(slug);
      const channel = fetched ?? {
        slug,
        displayName: slug,
        avatarUrl: '',
        followers: 0,
        isLive: false,
        viewers: 0,
        title: '',
        category: '',
      };
      await savePrivateStreamer(authUser.uid, channel);
      notify(fetched ? 'تمت إضافة القناة' : 'أضيفت القناة، وسنحدث حالتها لاحقاً', 'success');
      setValue('');
      onClose();
    } catch {
      notify('تعذر إضافة القناة', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="إضافة قناة خاصة">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-zinc-400">
          أدخل اسم القناة على كيك أو رابطها. ستظهر هذه القناة لك فقط.
        </p>
        <input
          dir="ltr"
          className="field text-start"
          placeholder="kick.com/channel-name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <Button type="submit" loading={saving} className="w-full">
          إضافة القناة
        </Button>
      </form>
    </Sheet>
  );
}
