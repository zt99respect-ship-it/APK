import { useEffect, useState } from 'react';
import { Pin, PinOff, Trash2 } from 'lucide-react';
import { Avatar, Button, RoleBadge } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { timeAgo, toDate } from '../../lib/format.js';
import { deletePost, fetchRecentPosts, setPostPinned } from '../../services/posts.js';

export default function ModerationTab() {
  const { notify } = useApp();
  const [posts, setPosts] = useState(null);
  const [busyId, setBusyId] = useState('');

  const load = () =>
    fetchRecentPosts(50)
      .then(setPosts)
      .catch(() => notify('تعذر تحميل المنشورات', 'error'));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePin = async (post) => {
    setBusyId(post.id);
    try {
      await setPostPinned(post.id, !post.pinned);
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, pinned: !post.pinned } : p)));
      notify(post.pinned ? 'تم إلغاء التثبيت' : 'تم تثبيت المنشور', 'success');
    } catch {
      notify('تعذر تحديث المنشور', 'error');
    } finally {
      setBusyId('');
    }
  };

  const remove = async (post) => {
    if (!window.confirm('هل تريد حذف هذا المنشور نهائياً؟')) return;
    setBusyId(post.id);
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      notify('تم حذف المنشور', 'success');
    } catch {
      notify('تعذر حذف المنشور', 'error');
    } finally {
      setBusyId('');
    }
  };

  if (posts === null) return <div className="glass h-24 animate-pulse rounded-3xl" />;
  if (!posts.length) return <p className="py-8 text-center text-sm text-zinc-500">لا توجد منشورات</p>;

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <article key={post.id} className="glass flex flex-col gap-3 rounded-3xl p-4">
          <div className="flex items-center gap-3">
            <Avatar src={post.authorAvatar} name={post.authorName} className="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-bold text-zinc-50">{post.authorName}</p>
                <RoleBadge role={post.authorRole} />
              </div>
              <p className="text-xs text-zinc-500">{timeAgo(toDate(post.createdAt))}</p>
            </div>
          </div>
          {post.text && <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{post.text}</p>}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="glass" className="h-10 text-xs" loading={busyId === post.id} onClick={() => togglePin(post)}>
              {post.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              {post.pinned ? 'إلغاء التثبيت' : 'تثبيت'}
            </Button>
            <Button variant="danger" className="h-10 text-xs" loading={busyId === post.id} onClick={() => remove(post)}>
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
