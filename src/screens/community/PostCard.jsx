import { motion } from 'framer-motion';
import { Heart, MessageCircle, Pin, PinOff, Trash2 } from 'lucide-react';
import { Avatar, IconButton, RoleBadge } from '../../components/ui.jsx';
import { timeAgo, toDate, formatCount } from '../../lib/format.js';

export default function PostCard({ post, viewerId, isStaff, onLike, onOpenComments, onDelete, onTogglePin }) {
  const liked = Boolean(post.likedBy?.includes(viewerId));
  const isOwner = post.authorId === viewerId;
  const likes = post.likesCount ?? post.likedBy?.length ?? 0;

  return (
    <article className="glass rounded-3xl p-4 transition-colors hover:bg-white/[0.07]">
      <header className="flex items-start gap-3">
        <Avatar src={post.authorAvatar} name={post.authorName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-bold text-zinc-50">{post.authorName}</p>
            <RoleBadge role={post.authorRole} />
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">{timeAgo(toDate(post.createdAt))}</p>
        </div>
        <div className="flex items-center">
          {isStaff && (
            <IconButton label={post.pinned ? 'إلغاء التثبيت' : 'تثبيت المنشور'} onClick={onTogglePin}>
              {post.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </IconButton>
          )}
          {(isOwner || isStaff) && (
            <IconButton label="حذف المنشور" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </header>

      {post.text && (
        <p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-zinc-100">{post.text}</p>
      )}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt=""
          loading="lazy"
          className="mt-3 max-h-96 w-full rounded-2xl object-cover ring-1 ring-white/10"
        />
      )}

      <footer className="mt-4 flex items-center gap-2">
        <motion.button
          type="button"
          onClick={onLike}
          whileTap={{ scale: 0.85 }}
          aria-pressed={liked}
          className={`flex h-10 items-center gap-2 rounded-full px-3 text-sm font-bold transition-colors ${
            liked ? 'bg-brand/15 text-brand-300' : 'text-zinc-400 hover:bg-white/10 hover:text-zinc-100'
          }`}
        >
          <Heart className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} />
          {formatCount(likes)}
        </motion.button>
        <button
          type="button"
          onClick={onOpenComments}
          className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
        >
          <MessageCircle className="h-5 w-5" />
          {formatCount(post.commentsCount || 0)}
        </button>
      </footer>
    </article>
  );
}
