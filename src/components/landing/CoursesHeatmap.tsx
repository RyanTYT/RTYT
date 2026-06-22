import { useState, useMemo } from 'react';
import {
  parseCourses,
  groupByCategory,
  SemesterOrder,
  gradeClass,
  buildReviews,
  type CourseRow,
} from '../../lib/courses';

interface Props {
  coursesRaw: string;
}

const ROWS = [
  { key: 'Computer Science', label: 'CS', colorClass: 'hm-rh-cs' },
  { key: 'Quant Finance', label: 'Finance', colorClass: 'hm-rh-fin' },
  { key: 'Business Analytics', label: 'Analytics', colorClass: 'hm-rh-ana' },
  { key: 'Mathematics', label: 'Math', colorClass: 'hm-rh-math' },
  { key: 'Business Core', label: 'Business', colorClass: 'hm-rh-biz' },
];

function cellColorClass(grade: string): string {
  if (grade === 'A+') return 'g-ap';
  if (grade === 'A') return 'g-a';
  if (grade === 'A-') return 'g-am';
  if (grade === 'B+') return 'g-bp';
  if (grade === 'B') return 'g-b';
  return 'g-s';
}

function gradeColorClass(grade: string): string {
  if (grade === 'A+') return 'text-iris';
  if (grade === 'A' || grade === 'A-') return 'text-foam';
  if (grade === 'B+' || grade === 'B') return 'text-gold';
  return 'text-mu';
}

function dotColor(grade: string): string {
  if (grade === 'A+') return '#c4a7e7';
  if (grade === 'A' || grade === 'A-') return '#9ccfd8';
  if (grade === 'B+' || grade === 'B') return '#f6c177';
  return '#908caa';
}

export default function CoursesHeatmap({ coursesRaw }: Props) {
  const courses = useMemo(() => parseCourses(coursesRaw), [coursesRaw]);
  const byCategory = useMemo(() => groupByCategory(courses), [courses]);
  const reviews = useMemo(() => buildReviews(courses), [courses]);

  const [panelData, setPanelData] = useState<{ mods: CourseRow[]; label: string; sem: string } | null>(null);
  const [openMod, setOpenMod] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // Build lookup: category|semester -> courses[]
  const lookup = useMemo(() => {
    const map: Record<string, CourseRow[]> = {};
    for (const row of ROWS) {
      const catCourses = byCategory[row.key] || [];
      for (const course of catCourses) {
        const key = `${row.key}|${course.Semester}`;
        if (!map[key]) map[key] = [];
        map[key].push(course);
      }
    }
    return map;
  }, [byCategory]);

  const handleCellClick = (mods: CourseRow[], label: string, sem: string, cellKey: string) => {
    setSelectedCell(cellKey);
    setPanelData({ mods, label, sem });
    setOpenMod(null);
  };

  return (
    <div className="hm-wrap">
      {/* Heatmap Grid */}
      <div className="hm-grid-box">
        <div className="hm-grid">
          {/* Header row */}
          <div></div>
          {SemesterOrder.map((sem) => (
            <div key={sem} className="hm-col-hdr">{sem}</div>
          ))}

          {/* Data rows by category */}
          {ROWS.map((row) => (
            <>
              <div key={`rh-${row.key}`} className={`hm-row-hdr ${row.colorClass}`}>
                {row.label}
              </div>
              {SemesterOrder.map((sem) => {
                const mods = lookup[`${row.key}|${sem}`] || [];
                const cellKey = `${row.key}|${sem}`;
                const isSelected = selectedCell === cellKey;

                if (mods.length === 0) {
                  return <div key={cellKey} className="hm-cell empty" />;
                }

                if (mods.length === 1) {
                  const m = mods[0];
                  return (
                    <div
                      key={cellKey}
                      className={`hm-cell ${cellColorClass(m.Grade)} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleCellClick(mods, row.label, sem, cellKey)}
                    >
                      <span className={`hc-code ${gradeColorClass(m.Grade)}`}>{m.Name}</span>
                      <span className={`hc-grade ${gradeColorClass(m.Grade)}`}>{m.Grade}</span>
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
                    className={`hm-cell multi ${cellColorClass(best.Grade)} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCellClick(mods, row.label, sem, cellKey)}
                  >
                    <div className="hc-stack">
                      {mods.slice(0, 3).map((m, i) => (
                        <div key={i} className="hc-dot" style={{ background: dotColor(m.Grade) }} />
                      ))}
                    </div>
                    <div className="hc-n">{mods.length}×</div>
                  </div>
                );
              })}
            </>
          ))}
        </div>

        {/* Legend */}
        <div className="hm-legend">
          <div className="hm-leg">
            <div className="hm-leg-sw hm-leg-ap" />
            A+
          </div>
          <div className="hm-leg">
            <div className="hm-leg-sw hm-leg-a" />
            A/A−
          </div>
          <div className="hm-leg">
            <div className="hm-leg-sw hm-leg-bp" />
            B+/B
          </div>
          <div className="hm-leg">
            <div className="hm-leg-sw hm-leg-s" />
            S
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="hm-panel">
        {!panelData ? (
          <div className="hm-panel-empty">
            ← click any cell to see details
          </div>
        ) : (
          <>
            <div className="hm-panel-sem">{panelData.label} · {panelData.sem} · {panelData.mods.length} module{panelData.mods.length > 1 ? 's' : ''}</div>
            {panelData.mods.map((course) => {
              const code = course.Name.trim();
              const review = reviews[code];
              const isOpen = openMod === code;
              return (
                <div
                  key={code}
                  className={`hm-panel-mod ${isOpen ? 'open' : ''} ${!review ? 'no-rv' : ''}`}
                  onClick={() => setOpenMod(isOpen ? null : code)}
                >
                  <div className={`pm-hdr${course.Grade === 'Exempted' ? ' pm-hdr-wide' : ''}`}>
                    <div>
                      <div className="pm-code">{code}</div>
                      <div className="pm-title">{course.Title}</div>
                    </div>
                    <span className={`pm-grade ${gradeClass(course.Grade)}`}>
                      {course.Grade}
                    </span>
                    <span className="pm-arrow">{review ? '▸' : ''}</span>
                  </div>
                  {review && (
                    <div className="hm-panel-review">{review}</div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
