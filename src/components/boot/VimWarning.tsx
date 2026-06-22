import { useState, useRef, useEffect } from 'react';

interface Props {
  onProceed: () => void;
  onBack: () => void;
}

export default function VimWarning({ onProceed, onBack }: Props) {
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed === 'q!' || trimmed === 'qa!' || trimmed === 'q') {
        onProceed();
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setValue('');
      }
    }
  };

  return (
    <div className="vw-wrap">
      <div className="vw-title">⚠ WARNING</div>
      <div className="vw-body">
        This portfolio uses <strong>vim keybindings</strong> for navigation.
        If you don't know how to exit vim, you probably can't exit this site either.
      </div>
      <div className="vw-hint">
        Type the command to quit vim and press Enter to proceed:
      </div>

      <div className={`vw-input-wrap${shake ? ' shake' : ''}`}>
        <span className="vw-colon">:</span>
        <input
          ref={inputRef}
          className="vw-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="..."
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <button className="vw-back" onClick={onBack}>
        ← escape back to normality
      </button>
    </div>
  );
}
