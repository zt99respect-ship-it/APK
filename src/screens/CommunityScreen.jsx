import { useEffect, useMemo, useState } from 'react';
import { Loader2, PenSquare } from 'lucide-react';
import { Button } from '../components/ui.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PullToRefresh from '../components/PullToRefresh.jsx';
import { PAGE_SIZE } from '../lib/constants.js';
import { useApp } from '../context/AppContext.jsx';
import {
  deletePost,
  fetchOlderPosts,
  fetchTrendingPosts,
  setPostLiked,
  setPostPinned,
  subscribeFirstPage,
  subscribePinnedPosts,
} from '../services/posts.js';
import PostCard from './community/PostCard.jsx';
import ComposeSheet from './community/ComposeSheet.jsx';
import CommentsSheet from './community/CommentsSheet.jsx';
import TrendingStrip from './community/TrendingStrip.jsx';

const toPost = (d) => ({ id: d.id, ...d.data() });

export default function CommunityScreen() {
  const { authUser, profile, isStaff, notify } = useApp();
  const uid = authUser.uid;
  const [firstDocs, setFirstDocs] = useState(null);
  const [firstLast, setFirstLast] = useState(null);
  const [olderPosts, setOlderPosts] = useState([]);
  const [olderCursor, setOlderCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pinned, setPinned] = useState([]);
  const [trending, setTrending] = useState([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const onError = () => notify('تعذر تحميل المنشورات', 'error');
    const unsubs = [
      subscribeFirstPage((docs, last) => {
        setFirstDocs(docs);
        setFirstLast(last);
      }, onError),
      subscribePinnedPosts(setPinned, onError),
    ];
    fetchTrendingPosts().then(setTrending).catch(() => {});
    return () => unsubs.forEach((u) => u());
  }, [notify]);

  const pinnedIds = useMemo(() => new Set(pinned.map((p) => p.id)), [pinned]);

  const feed = useMemo(() => {
    const first = (firstDocs || []).map(toPost);
    const seen = new Set();
    return [...first, ...olderPosts].filter((p) => {
      if (seen.has(p.id) || pinnedIds.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [firstDocs, olderPosts, pinnedIds]);

  const cursor = olderCursor ?? firstLast;
  const moreAvailable = hasMore && (olderPosts.length > 0 || (firstDocs?.length ?? 0) === PAGE_SIZE);

  const loadMore = async () => {
    if (loadingMore || !moreAvailable || !cursor) return;
    setLoadingMore(true);
    try {
      const { docs, lastDoc } = await fetchOlderPosts(cursor);
      setOlderPosts((prev) => [...prev, ...docs.map(toPost)]);
      setOlderCursor(lastDoc ?? cursor);
      setHasMore(docs.length === PAGE_SIZE);
    } catch {
      notify('تعذر تحميل المزيد', 'error');
    } finally {
      setLoadingMore(false);
    }
  };

  const refresh = async () => {
    setOlderPosts([]);
    setOlderCursor(null);
    setHasMore(true);
    setTrending(await fetchTrendingPosts().catch(() => []));
  };

  const handleLike = async (post) => {
    const liked = post.likedBy?.includes(uid);
    try {
      await setPostLiked(post.id, uid, !liked);
      setOlderPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                likedBy: liked ? p.likedBy.filter((id) => id !== uid) : [...(p.likedBy || []), uid],
                likesCount: (p.likesCount || 0) + (liked ? -1 : 1),
              }
            : p,
        ),
      );
    } catch {
      notify('تعذر تنفيذ الإعجاب', 'error');
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm('هل تريد حذف هذا المنشور؟')) return;
    try {
      await deletePost(post.id);
      notify('تم حذف المنشور', 'success');
    } catch {
      notify('تعذر حذف المنشور', 'error');
    }
  };

  const handleTogglePin = async (post) => {
    try {
      await setPostPinned(post.id, !post.pinned);
      notify(post.pinned ? 'تم إلغاء التثبيت' : 'تم تثبيت المنشور', 'success');
    } catch {
      notify('تعذر تحديث المنشور', 'error');
    }
  };

  const renderPost = (post) => (
    <PostCard
      key={post.id}
      post={post}
      viewerId={uid}
      isStaff={isStaff}
      onLike={() => handleLike(post)}
      onOpenComments={() => setActivePost(post)}
      onDelete={() => handleDelete(post)}
      onTogglePin={() => handleTogglePin(post)}
    />
  );

  const isEmpty = firstDocs !== null && feed.length === 0 && pinned.length === 0;

  return (
    <>
      <PullToRefresh onRefresh={refresh} className="px-4 pb-32 pt-5">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-50">المجتمع</h1>
            <p className="mt-1 text-sm text-zinc-400">شارك أفكارك مع أعضاء ريسبكت</p>
          </div>
          <Button className="h-11 px-4" onClick={() => setComposeOpen(true)} disabled={profile?.muted}>
            <PenSquare className="h-4 w-4" />
            منشور
          </Button>
        </div>

        <TrendingStrip posts={trending} onOpen={setActivePost} />

        {pinned.length > 0 && (
          <section className="mb-5 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-zinc-300">منشورات مثبتة</h2>
            {pinned.map(renderPost)}
          </section>
        )}

        {firstDocs === null && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        )}

        {isEmpty && (
          <EmptyState
            title="لا توجد منشورات بعد"
            description="كن أول من يكتب في مجتمع ريسبكت وابدأ النقاش."
            action={
              <Button onClick={() => setComposeOpen(true)}>
                <PenSquare className="h-4 w-4" />
                اكتب أول منشور
              </Button>
            }
          />
        )}

        <div className="flex flex-col gap-4">{feed.map(renderPost)}</div>

        {feed.length > 0 && moreAvailable && (
          <div className="mt-6 flex justify-center">
            <Button variant="glass" onClick={loadMore} loading={loadingMore}>
              تحميل المزيد
            </Button>
          </div>
        )}
        {feed.length > 0 && !moreAvailable && (
          <p className="mt-8 text-center text-xs text-zinc-500">وصلت إلى نهاية المنشورات</p>
        )}
      </PullToRefresh>

      <ComposeSheet open={composeOpen} onClose={() => setComposeOpen(false)} />
      <CommentsSheet post={activePost} onClose={() => setActivePost(null)} />
    </>
  );
}
