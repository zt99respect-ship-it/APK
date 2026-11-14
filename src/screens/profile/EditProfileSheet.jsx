import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import Sheet from '../../components/Sheet.jsx';
import { Button } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { uploadImage } from '../../lib/imageUpload.js';
import { updateUser } from '../../services/users.js';

const isHttpUrl = (value) => /^https?:\/\/\S+$/i.test(value);

function ImageField({ label, value, onChange, onUpload, uploading, aspectClass, previewClass }) {
  const inputId = `profile-${label}`;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-bold text-zinc-200">{label}</p>
      <div className={`relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 ${aspectClass}`}>
        {value ? (
          <img src={value} alt={label} className={`h-full w-full object-cover ${previewClass}`} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">لا توجد صورة</div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-100" />
          </div>
        )}
      </div>
      <input id={inputId} type="file" accept="image/*" className="hidden" onChange={onUpload} />
      <div className="flex gap-2">
        <label
          htmlFor={inputId}
          className="glass inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-2xl px-4 text-sm font-bold text-zinc-100 transition-colors hover:bg-white/10"
        >
          <Camera className="h-4 w-4" />
          رفع صورة
        </label>
        <input
          dir="ltr"
          className="field h-11 text-start"
          placeholder="أو الصق رابط الصورة"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function EditProfileSheet({ open, onClose }) {
  const { authUser, profile, notify } = useApp();
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl || '');
  const [uploading, setUploading] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpload = (field, setter) => async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(field);
    try {
      setter(await uploadImage(file));
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setUploading('');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const urls = [avatarUrl.trim(), bannerUrl.trim()];
    if (urls.some((u) => u && !isHttpUrl(u))) {
      notify('الرابط يجب أن يبدأ بـ https://', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateUser(authUser.uid, {
        bio: bio.trim().slice(0, 160),
        avatarUrl: urls[0],
        bannerUrl: urls[1],
      });
      notify('تم حفظ الملف الشخصي', 'success');
      onClose();
    } catch {
      notify('تعذر حفظ التغييرات', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="تعديل الملف الشخصي">
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <ImageField
          label="صورة الغلاف"
          value={bannerUrl}
          onChange={setBannerUrl}
          onUpload={handleUpload('banner', setBannerUrl)}
          uploading={uploading === 'banner'}
          aspectClass="aspect-[3/1]"
        />
        <ImageField
          label="الصورة الشخصية"
          value={avatarUrl}
          onChange={setAvatarUrl}
          onUpload={handleUpload('avatar', setAvatarUrl)}
          uploading={uploading === 'avatar'}
          aspectClass="aspect-square max-w-[8rem]"
        />
        <label className="flex flex-col gap-3">
          <span className="text-sm font-bold text-zinc-200">نبذة</span>
          <textarea
            className="field min-h-24 resize-none"
            maxLength={160}
            placeholder="اكتب نبذة قصيرة عنك"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        <Button type="submit" loading={saving} disabled={Boolean(uploading)} className="w-full">
          حفظ التغييرات
        </Button>
      </form>
    </Sheet>
  );
}
