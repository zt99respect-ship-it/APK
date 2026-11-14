import { useRef } from 'react';
import { ExternalLink, Maximize } from 'lucide-react';
import Sheet from '../../components/Sheet.jsx';
import { Button } from '../../components/ui.jsx';
import { kickChannelUrl, kickPlayerUrl } from '../../lib/kick.js';

export default function PlayerSheet({ streamer, onClose }) {
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    containerRef.current?.requestFullscreen?.();
  };

  return (
    <Sheet open={Boolean(streamer)} onClose={onClose} title={streamer?.displayName || ''}>
      {streamer && (
        <div className="flex flex-col gap-4">
          <div ref={containerRef} className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
            <iframe
              key={streamer.slug}
              src={kickPlayerUrl(streamer.slug)}
              title={streamer.displayName}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex gap-2">
            <Button variant="glass" onClick={toggleFullscreen} className="flex-1">
              <Maximize className="h-4 w-4" />
              ملء الشاشة
            </Button>
            <a
              href={kickChannelUrl(streamer.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-zinc-100 transition-colors hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" />
              فتح في كيك
            </a>
          </div>
          {streamer.title && <p className="text-sm leading-relaxed text-zinc-300">{streamer.title}</p>}
          <p className="text-xs leading-relaxed text-zinc-500">
            التحكم بالجودة والصوت متوفر داخل مشغل كيك نفسه.
          </p>
        </div>
      )}
    </Sheet>
  );
}
