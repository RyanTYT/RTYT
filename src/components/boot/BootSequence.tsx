import { useState, useEffect, useRef, useCallback } from 'react';
import { BOOT_TASKS, type BootTask } from '../../lib/boot-tasks';

interface Props {
  onComplete: () => void;
}

interface LogLine {
  time: string;
  status: 'ok' | 'warn';
  message: string;
}

export default function BootSequence({ onComplete }: Props) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [blink, setBlink] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const calledComplete = useRef(false);
  const startTime = useRef(performance.now());

  // Run boot tasks sequentially with random delays
  useEffect(() => {
    let cancelled = false;
    startTime.current = performance.now();

    async function runTasks() {
      for (let i = 0; i < BOOT_TASKS.length; i++) {
        if (cancelled) return;
        const task = BOOT_TASKS[i];
        const delay = task.min + Math.random() * (task.max - task.min);
        await new Promise((r) => setTimeout(r, delay));
        if (cancelled) return;

        const elapsed = ((performance.now() - startTime.current) / 1000).toFixed(3);

        setLines((prev) => [
          ...prev,
          {
            time: `${elapsed}s`,
            status: task.warn ? 'warn' : 'ok',
            message: task.message,
          },
        ]);
        setProgress(Math.round(((i + 1) / BOOT_TASKS.length) * 100));
      }

      if (!cancelled) {
        // Fill progress bar animation
        await new Promise((r) => setTimeout(r, 300));
        setProgress(100);
        await new Promise((r) => setTimeout(r, 500));
        setDone(true);
      }
    }

    runTasks();
    return () => { cancelled = true; };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Blink cursor
  useEffect(() => {
    if (!done) return;
    const iv = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(iv);
  }, [done]);

  // Listen for keypress/click after done
  const handleContinue = useCallback(() => {
    if (done && !calledComplete.current) {
      calledComplete.current = true;
      onComplete();
    }
  }, [done, onComplete]);

  useEffect(() => {
    if (!done) return;
    const handler = () => handleContinue();
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [done, handleContinue]);

  return (
    <>
      {/* Boot log */}
      <div id="boot-scroll" ref={scrollRef}>
        {lines.map((line, i) => (
          <div key={i} className="bln show">
            <span className="bt">{line.time}</span>
            <span className={`bs ${line.status}`}>
              [{line.status === 'ok' ? ' OK ' : 'WARN'}]
            </span>
            <span className="bm" dangerouslySetInnerHTML={{ __html: line.message }} />
          </div>
        ))}
      </div>

      {/* Progress area */}
      <div className="boot-hero">
        <div className="bhn">RyanOS</div>
        <div className="bhs">{done ? 'ready' : 'loading environment...'}</div>
        <div className="bbr">
          <div className="bbar">
            <div className="bbf" style={{ width: `${progress}%` }} />
          </div>
          <span className="bpct">{progress}%</span>
        </div>
        <div className={`bready ${done && blink ? 'bready-visible' : 'bready-hidden'}`}>
          Press any key to continue...
        </div>
      </div>
    </>
  );
}
