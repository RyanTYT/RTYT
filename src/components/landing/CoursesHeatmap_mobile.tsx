import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  parseCourses,
  groupByCategory,
  buildReviews,
  gradeClass,
  SemesterOrder,
  type CourseRow,
} from '../../lib/courses';

interface Props {
  coursesRaw: string;
}

const CATEGORIES = [
  { key: 'Computer Science', label: 'CS', color: '#9ccfd8' },
  { key: 'Quant Finance', label: 'Fin', color: '#c4a7e7' },
  { key: 'Business Analytics', label: 'Ana', color: '#f6c177' },
  { key: 'Mathematics', label: 'Math', color: '#eb6f92' },
  { key: 'Business Core', label: 'Biz', color: '#ebbcba' },
];

function cellColorClass(grade: string): string {
  if (grade === 'A+') return 'g-ap';
  if (grade === 'A') return 'g-a';
  if (grade === 'A-') return 'g-am';
  if (grade === 'B+') return 'g-bp';
  if (grade === 'B') return 'g-b';
  return 'g-s';
}

export default function CoursesHeatmapMobile({ coursesRaw }: Props) {
  const courses = useMemo(() => parseCourses(coursesRaw), [coursesRaw]);
  const byCategory = useMemo(() => groupByCategory(courses), [courses]);
  const reviews = useMemo(() => buildReviews(courses), [courses]);

  const [sheetData, setSheetData] = useState<{ mods: CourseRow[]; sem: string; cat: string } | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expandedMod, setExpandedMod] = useState<string | null>(null);

  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const dragging = useRef(false);

  // Build transposed lookup: semester|category -> courses[]
  const lookup = useMemo(() => {
    const map: Record<string, CourseRow[]> = {};
    for (const cat of CATEGORIES) {
      const catCourses = byCategory[cat.key] || [];
      for (const course of catCourses) {
        const key = `${course.Semester}|${cat.key}`;
        if (!map[key]) map[key] = [];
        map[key].push(course);
      }
    }
    return map;
  }, [byCategory]);

  const handleCellTap = useCallback((mods: CourseRow[], sem: string, cat: string) => {
    if (mods.length === 0) return;
    setSheetData({ mods, sem, cat });
    setSheetOpen(true);
    setExpandedMod(null);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => setSheetData(null), 300);
  }, []);

  // Swipe-down to dismiss
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    dragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging.current || !sheetRef.current) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy > 0) {
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!dragging.current || !sheetRef.current) return;
    dragging.current = false;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy > 100) {
      closeSheet();
    }
    sheetRef.current.style.transform = '';
  }, [closeSheet]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sheetOpen]);

  return (
    <div className="m-hm-wrap">
      {/* Grid */}
      <div
        className="m-hm-grid"
        style={{
          gridTemplateColumns: `60px repeat(${CATEGORIES.length}, 48px)`,
          gridTemplateRows: `24px repeat(${SemesterOrder.length}, 44px)`,
        }}
      >
        {/* Top-left empty corner */}
        <div className="m-hm-corner" />

        {/* Category column headers */}
        {CATEGORIES.map((cat) => (
          <div key={cat.key} className="m-hm-col-hdr" style={{ color: cat.color }}>
            {cat.label}
          </div>
        ))}

        {/* Rows: each semester */}
        {SemesterOrder.map((sem) => (
          <>
            <div key={`rh-${sem}`} className="m-hm-row-hdr">
              {sem}
            </div>
            {CATEGORIES.map((cat) => {
              const cellKey = `${sem}|${cat.key}`;
              const mods = lookup[cellKey] || [];

              if (mods.length === 0) {
                return <div key={cellKey} className="m-hm-cell m-hm-empty" />;
              }

              if (mods.length === 1) {
                const m = mods[0];
                return (
                  <div
                    key={cellKey}
                    className={`m-hm-cell ${cellColorClass(m.Grade)}`}
                    onClick={() => handleCellTap(mods, sem, cat.label)}
                  >
                    <span className="m-hm-grade">{m.Grade}</span>
                  </div>
                );
              }

              // Multi-module cell
              const gradeOrder: Record<string, number> = { 'A+': 0, 'A': 1, 'A-': 2, 'B+': 3, 'B': 4, 'S': 5 };
              const best = mods.reduce((b, m) =>
                (gradeOrder[m.Grade] ?? 9) < (gradeOrder[b.Grade] ?? 9) ? m : b
              );
              return (
                <div
                  key={cellKey}
                  className={`m-hm-cell m-hm-multi ${cellColorClass(best.Grade)}`}
                  onClick={() => handleCellTap(mods, sem, cat.label)}
                >
                  <span className="m-hm-badge">{mods.length}</span>
                </div>
              );
            })}
          </>
        ))}
      </div>

      {/* Legend */}
      <div className="m-hm-legend">
        <span className="m-hm-leg"><span className="m-hm-sw g-ap" />A+</span>
        <span className="m-hm-leg"><span className="m-hm-sw g-a" />A/A−</span>
        <span className="m-hm-leg"><span className="m-hm-sw g-bp" />B+/B</span>
        <span className="m-hm-leg"><span className="m-hm-sw g-s" />S</span>
      </div>

      {/* Bottom Sheet Overlay */}
      <div
        className={`m-hm-sheet-overlay${sheetOpen ? ' visible' : ''}`}
        onClick={closeSheet}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`m-hm-sheet${sheetOpen ? ' open' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="m-hm-sheet-handle">
          <div className="m-hm-sheet-bar" />
        </div>

        {sheetData && (
          <div className="m-hm-sheet-content">
            <div className="m-hm-sheet-header">
              <span className="m-hm-sheet-sem">{sheetData.sem}</span>
              <span className="m-hm-sheet-cat">{sheetData.cat}</span>
              <span className="m-hm-sheet-count">
                {sheetData.mods.length} module{sheetData.mods.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="m-hm-sheet-modules">
              {sheetData.mods.map((course) => {
                const code = course.Name?.trim() || course.ModuleCode?.trim();
                const review = reviews[code];
                const isExpanded = expandedMod === code;

                return (
                  <div
                    key={code}
                    className="m-hm-sheet-mod"
                    onClick={() => setExpandedMod(isExpanded ? null : code)}
                  >
                    <div className="m-hm-sheet-mod-hdr">
                      <div className="m-hm-sheet-mod-info">
                        <span className="m-hm-sheet-mod-code">{course.Name}</span>
                        <span className="m-hm-sheet-mod-title">{course.Title}</span>
                      </div>
                      <span className={`m-hm-sheet-mod-grade ${gradeClass(course.Grade)}`}>
                        {course.Grade}
                      </span>
                    </div>
                    {review && (
                      <div className={`m-hm-sheet-mod-review${isExpanded ? ' visible' : ''}`}>
                        {review}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
