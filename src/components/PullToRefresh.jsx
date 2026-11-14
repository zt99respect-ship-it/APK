import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const THRESHOLD = 70;
const MAX_PULL = 110;

export default function PullToRefresh({ onRefresh, className = '', children }) {
  const containerRef = useRef(null);
  const startY = useRef(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onTouchStart = (e) => {
    if (refreshing || containerRef.current.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta <= 0) {
      setPull(0);
      return;
    }
    setPull(Math.min(delta * 0.5, MAX_PULL));
  };

  const onTouchEnd = async () => {
    const shouldRefresh = pull >= THRESHOLD;
    startY.current = null;
    if (!shouldRefresh) {
      setPull(0);
      return;
    }
    setRefreshing(true);
    setPull(THRESHOLD * 0.7);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
      setPull(0);
    }
  };

  const indicatorHeight = refreshing ? THRESHOLD * 0.7 : pull;

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`h-full overflow-y-auto overscroll-y-contain no-scrollbar ${className}`}
    >
      <motion.div
        style={{ height: indicatorHeight }}
        className="flex items-center justify-center overflow-hidden"
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <RefreshCw
          className={`h-5 w-5 text-zinc-400 ${refreshing ? 'animate-spin' : ''}`}
          style={{ transform: refreshing ? undefined : `rotate(${pull * 3}deg)`, opacity: Math.min(1, pull / THRESHOLD) }}
        />
      </motion.div>
      {children}
    </div>
  );
}
