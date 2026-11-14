import { Flame, Heart } from 'lucide-react';
import { Avatar } from '../../components/ui.jsx';
import { formatCount } from '../../lib/format.js';

export default function TrendingStrip({ posts, onOpen }) {
  if (!posts?.length) return null;
  return (
    <section className="mb-7">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-300">
        <Flame className="h-4 w-4 text-zinc-300" />
        الرائج هذا الأسبوع
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => onOpen(post)}
            className="glass flex w-64 shrink-0 flex-col gap-3 rounded-3xl p-4 text-start transition-transform active:scale-[0.97]"
          >
            <div className="flex items-center gap-2">
              <Avatar src={post.authorAvatar} name={post.authorName} className="h-8 w-8" />
              <p className="truncate text-xs font-bold text-zinc-200">{post.authorName}</p>
            </div>
            <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-zinc-100">
              {post.text || 'صورة'}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400">
              <Heart className="h-3.5 w-3.5" />
              {formatCount(post.likesCount || 0)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
