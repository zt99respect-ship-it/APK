import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import Sheet from '../../components/Sheet.jsx';
import { kickChannelUrl } from '../../lib/kick.js';

export default function PlayerSheet({ streamer, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [hls, setHls] = useState(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = Auto
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!streamer?.slug) return;
    
    setIsLoading(true);
    setError(false);

    // جلب رابط البث المباشر من KICK API
    fetch(`https://kick.com/api/v2/channels/${streamer.slug}`)
      .then(res => res.json())
      .then(data => {
        const playbackUrl = data?.playback_url;
        if (!playbackUrl) throw new Error("Stream is offline or URL not found");

        if (videoRef.current) {
          if (Hls.isSupported()) {
            const hlsInstance = new Hls({
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
            });
            
            hlsInstance.loadSource(playbackUrl);
            hlsInstance.attachMedia(videoRef.current);
            
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
              setLevels(data.levels);
              videoRef.current.play().catch(() => setIsPlaying(false));
              setIsLoading(false);
            });

            hlsInstance.on(Hls.Events.ERROR, (event, data) => {
              if (data.fatal) setError(true);
            });

            setHls(hlsInstance);
          } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            // دعم iOS Safari الأصلي
            videoRef.current.src = playbackUrl;
            videoRef.current.addEventListener('loadedmetadata', () => {
              videoRef.current.play().catch(() => setIsPlaying(false));
              setIsLoading(false);
            });
          }
        }
      })
      .catch(err => {
        console.error("KICK API Error:", err);
        setError(true);
        setIsLoading(false);
      });

    return () => {
      if (hls) hls.destroy();
    };
  }, [streamer?.slug]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen();
    }
  };

  const handleQualityChange = (levelIndex) => {
    if (hls) {
      hls.currentLevel = levelIndex;
      setCurrentLevel(levelIndex);
    }
    setShowSettings(false);
  };

  return (
    <Sheet open={Boolean(streamer)} onClose={onClose} title={streamer?.displayName || ''}>
      {streamer && (
        <div className="flex flex-col gap-4">
          <div 
            ref={containerRef} 
            className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black group"
          >
            {/* الفيديو */}
            <video
              ref={videoRef}
              className="h-full w-full object-contain"
              playsInline
              onClick={togglePlay}
            />

            {/* شاشة التحميل */}
            {isLoading && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                <Loader2 className="h-10 w-10 text-[#53FC18] animate-spin mb-4" />
                <p className="text-white font-bold">جاري الاتصال ببث {streamer.displayName}...</p>
              </div>
            )}

            {/* شاشة الخطأ */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20 p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-white font-bold mb-2">تعذر تشغيل البث داخل التطبيق</p>
                <p className="text-zinc-400 text-sm mb-6">قد يكون الستريمر غير متصل، أو أن متصفحك يمنع التشغيل.</p>
                <a 
                  href={kickChannelUrl(streamer.slug)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#53FC18] text-black font-bold rounded-full"
                >
                  فتح في تطبيق KICK
                </a>
              </div>
            )}

            {/* أزرار التحكم (تظهر عند تمرير الماوس أو اللمس) */}
            {!error && !isLoading && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-100 transition-opacity duration-300 z-10">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="hover:text-[#53FC18] transition">
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    <button onClick={toggleMute} className="hover:text-[#53FC18] transition">
                      {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* إعدادات الجودة */}
                    <div className="relative">
                      <button onClick={() => setShowSettings(!showSettings)} className="hover:text-[#53FC18] transition">
                        <Settings className="h-6 w-6" />
                      </button>
                      {showSettings && levels.length > 0 && (
                        <div className="absolute bottom-10 right-0 bg-zinc-900/95 border border-white/10 rounded-xl p-2 min-w-[120px] backdrop-blur-xl">
                          <button onClick={() => handleQualityChange(-1)} className={`block w-full text-right px-4 py-2 text-sm rounded-lg hover:bg-white/10 ${currentLevel === -1 ? 'text-[#53FC18] font-bold' : 'text-white'}`}>تلقائي (Auto)</button>
                          {levels.map((level, idx) => (
                            <button key={idx} onClick={() => handleQualityChange(idx)} className={`block w-full text-right px-4 py-2 text-sm rounded-lg hover:bg-white/10 ${currentLevel === idx ? 'text-[#53FC18] font-bold' : 'text-white'}`}>
                              {level.height}p
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={toggleFullscreen} className="hover:text-[#53FC18] transition">
                      <Maximize className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
             <a
              href={kickChannelUrl(streamer.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-zinc-300 transition-colors hover:bg-white/10"
            >
              <ExternalLink className="h-3 w-3" />
              فتح في كيك
            </a>
            {streamer.title && <p className="text-sm font-medium text-zinc-300 truncate pr-4">{streamer.title}</p>}
          </div>
        </div>
      )}
    </Sheet>
  );
}