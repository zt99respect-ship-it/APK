import { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Sheet from '../../components/Sheet.jsx';
import { Button, IconButton } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { uploadImage } from '../../lib/imageUpload.js';
import { createPost } from '../../services/posts.js';

const MAX_TEXT = 500;

export default function ComposeSheet({ open, onClose }) {
  const { profile, notify } = useApp();
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const reset = () => {
    setText('');
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith('image/')) {
      notify('اختر ملف صورة فقط', 'error');
      return;
    }
    setFile(picked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value && !file) return;
    if (profile.muted) {
      notify('حسابك مكتوم ولا يمكنه النشر', 'error');
      return;
    }
    setSubmitting(true);
    let imageUrl = '';
    try {
      if (file) imageUrl = await uploadImage(file);
    } catch (err) {
      notify(err.message, 'error');
      setSubmitting(false);
      return;
    }
    try {
      await createPost(profile, { text: value, imageUrl });
      notify('تم نشر المنشور', 'success');
      reset();
      onClose();
    } catch {
      notify('تعذر النشر، حاول مرة أخرى', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="منشور جديد">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <textarea
            className="field min-h-32 resize-none leading-relaxed"
            placeholder="ماذا يحدث في مجتمع ريسبكت؟"
            value={text}
            maxLength={MAX_TEXT}
            onChange={(e) => setText(e.target.value)}
          />
          <span className="pointer-events-none absolute bottom-3 end-4 text-xs text-zinc-500">
            {text.length}/{MAX_TEXT}
          </span>
        </div>

        {previewUrl && (
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
            <img src={previewUrl} alt="معاينة" className="max-h-64 w-full object-cover" />
            <IconButton
              label="إزالة الصورة"
              onClick={reset}
              className="absolute end-2 top-2 bg-black/60 backdrop-blur"
            >
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handlePick} id="compose-image" />
          <label
            htmlFor="compose-image"
            className="glass inline-flex h-12 cursor-pointer items-center gap-2 rounded-2xl px-4 text-sm font-bold text-zinc-100 transition-colors hover:bg-white/10"
          >
            <ImagePlus className="h-5 w-5" />
            إضافة صورة
          </label>
          <Button type="submit" loading={submitting} disabled={!text.trim() && !file} className="flex-1">
            نشر
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
