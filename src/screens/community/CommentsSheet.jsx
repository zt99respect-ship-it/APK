import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import Sheet from '../../components/Sheet.jsx';
import { Avatar, Button, RoleBadge } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { timeAgo, toDate } from '../../lib/format.js';
import { addComment, subscribeComments } from '../../services/posts.js';

const MAX_COMMENT = 280;

export default function CommentsSheet({ post, onClose }) {
  const { profile, notify } = useApp();
  const [comments, setComments] = useState(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const postId = post?.id;

  useEffect(() => {
    if (!postId) return undefined;
    setComments(null);
    return subscribeComments(
      postId,
      setComments,
      () => notify('تعذر تحميل التعليقات', 'error'),
    );
  }, [postId, notify]);

  const handleSend = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    if (profile.muted) {
      notify('حسابك مكتوم ولا يمكنه التعليق', 'error');
      return;
    }
    setSending(true);
    try {
      await addComment(postId, profile, value);
      setText('');
    } catch {
      notify('تعذر إرسال التعليق', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={Boolean(post)} onClose={onClose} title="التعليقات">
      <div className="flex flex-col gap-4">
        <div className="max-h-[50dvh] overflow-y-auto pe-1">
          {comments === null && <p className="py-8 text-center text-sm text-zinc-500">جارٍ التحميل...</p>}
          {comments?.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-500">كن أول من يعلّق على هذا المنشور</p>
          )}
          <ul className="flex flex-col gap-4">
            {comments?.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <Avatar src={c.authorAvatar} name={c.authorName} className="h-9 w-9" />
                <div className="min-w-0 flex-1 rounded-2xl bg-white/5 px-3 py-2.5 ring-1 ring-white/5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-zinc-50">{c.authorName}</p>
                    <RoleBadge role={c.authorRole} />
                    <span className="text-[11px] text-zinc-500">{timeAgo(toDate(c.createdAt))}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-200">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            className="field h-12"
            placeholder="اكتب تعليقاً..."
            value={text}
            maxLength={MAX_COMMENT}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" loading={sending} disabled={!text.trim()} className="h-12 w-12 shrink-0 px-0" aria-label="إرسال">
            {!sending && <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Sheet>
  );
}
