import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { parseCourses, groupBySemester, SemesterOrder, gradeClass, computeSemesterGPA, computeCumulativeGPA, type CourseRow } from '../../lib/courses';

interface Props {
  coursesRaw: string;
}

/* ─── Semester data (same as desktop) ─── */
const SEM_FULFILLMENT = [6, 7, 7, 8, 9, 7, 6, 9];
const SEM_PROJECTS_SCORE = [2, 5, 6, 7, 9, 8, 5, 10];
const SEM_LABELS = ['Foundations', 'Discovery', 'Deep Dive', 'Specialisation', 'Peak Performance', 'Industry Ready', 'Final Push', 'Capstone'];
const SEM_NARRATIVES = [
  "First semester — adjusting to uni, discovering programming isn't just a hobby. Took CS2030 alongside business core. Already thinking about trading.",
  'Found my rhythm. Accounting + Calculus + Legal. Started AutoTrader in Python. Orbital project. First taste of building something real.',
  'Double degree kicks in. Finance, Econometrics, Data Viz. Realized quant finance is the intersection I want.',
  'Investment Analysis was transformative — portfolio theory clicked. Computational Methods gave Monte Carlo skills.',
  'Peak performance. Capital Market Trading Analytics + Fraud Analytics. Coursework directly feeds the live trading system.',
  'SAP ATAP starts. Balancing internship + courses. LLM pipeline idea born during SAP work.',
  'Full SAP internship + clearing CS requirements. ML, Networks, Computer Org. Absorbing systems knowledge.',
  'Final semester. OS + Parallel Computing, Options & Futures + Financial Modelling. Rewriting everything in Rust.',
];
const SEM_PROJECT_ITEMS: Record<string, string[]> = {
  Y1S1: ['Exploring Python for data analysis', 'First algo trading ideas (paper only)'],
  Y1S2: ['AutoTrader v0.1 — Python backtesting', 'Orbital — full-stack web app'],
  Y2S1: ['AutoTrader v0.5 — live paper trading', 'Reading: "Advances in Financial ML"'],
  Y2S2: ['AutoTrader v1.0 — first live trades', 'Monte Carlo simulation projects'],
  Y3S1: ['Trading bot managing real portfolio', 'Factor model implementation', 'Blog started'],
  Y3S2: ['LLM research pipeline inception', 'SAP AI features shipped', 'Signal engineering'],
  Y4S1: ['LLM pipeline v2 (multi-provider)', 'SAP ATAP completed', 'Tauri dashboard'],
  Y4S2: ['Full Rust rewrite of trading platform', 'Multi-currency IBKR', 'This portfolio site'],
};

/* ─── SVG Chart helper ─── */
function drawChart(data: number[], max: number, color: string, activeIdx: number): string {
  const w = 240, h = 64, padX = 8, padTop = 18, padBot = 8, n = data.length;
  const pts = data.map((v, i) => ({
    x: padX + (i / (n - 1)) * (w - padX * 2),
    y: h - padBot - ((v - Math.min(...data) * 0.8) / (max - Math.min(...data) * 0.8)) * (h - padTop - padBot),
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const dots = pts.map((p, i) =>
    `<circle cx="${p.x}" cy="${p.y}" r="${i === activeIdx ? 4 : 2.5}" fill="${i === activeIdx ? color : 'rgba(144,140,170,.5)'}" stroke="${i === activeIdx ? color : 'none'}" stroke-width="1.5"/>`
  ).join('');
  const val = data[activeIdx];
  const valStr = Number.isInteger(val) ? val.toString() : val.toFixed(2);
  const label = pts[activeIdx] ? `<text x="${pts[activeIdx].x}" y="${pts[activeIdx].y - 8}" font-size="9" fill="${color}" text-anchor="middle" font-family="var(--f)">${valStr}</text>` : '';
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px"><path d="${line}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>${dots}${label}</svg>`;
}

/* ─── Charts Bottom Sheet ─── */
function ChartsSheet({ activeIdx, gpaData, cumGpaData, open, onClose }: { activeIdx: number; gpaData: number[]; cumGpaData: number[]; open: boolean; onClose: () => void }) {
  const gpaChart = useMemo(() => drawChart(gpaData, 5.0, 'var(--foam)', activeIdx), [activeIdx, gpaData]);
  const cumGpaChart = useMemo(() => drawChart(cumGpaData, 5.0, 'var(--pine)', activeIdx), [activeIdx, cumGpaData]);
  const fulfillChart = useMemo(() => drawChart(SEM_FULFILLMENT, 10, 'var(--iris)', activeIdx), [activeIdx]);
  const projChart = useMemo(() => drawChart(SEM_PROJECTS_SCORE, 10, 'var(--gold)', activeIdx), [activeIdx]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className={`m-sheet-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`m-tl-charts-sheet${open ? ' open' : ''}`}>
        <div className="m-sheet-handle" />
        <div className="m-tl-chart-group">
          <div className="m-tl-chart-item">
            <span className="m-tl-chart-label">GPA</span>
            <div dangerouslySetInnerHTML={{ __html: gpaChart }} />
          </div>
          <div className="m-tl-chart-item">
            <span className="m-tl-chart-label">Cumulative GPA</span>
            <div dangerouslySetInnerHTML={{ __html: cumGpaChart }} />
          </div>
          <div className="m-tl-chart-item">
            <span className="m-tl-chart-label">Fulfillment</span>
            <div dangerouslySetInnerHTML={{ __html: fulfillChart }} />
          </div>
          <div className="m-tl-chart-item">
            <span className="m-tl-chart-label">Projects</span>
            <div dangerouslySetInnerHTML={{ __html: projChart }} />
          </div>
        </div>
        <div className="m-tl-charts-legend">
          {SemesterOrder.map((s, i) => (
            <span key={s} className={`m-tl-charts-leg-item${i === activeIdx ? ' active' : ''}`}>{s}</span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Module Card ─── */
function ModuleCard({ course }: { course: CourseRow }) {
  return (
    <div className={`m-tl-mod ${gradeClass(course.Grade)}`}>
      <span className="m-tl-mod-code">{course.Name}</span>
      <span className="m-tl-mod-title">{course.Title}</span>
      <span className="m-tl-mod-grade">{course.Grade}</span>
    </div>
  );
}

/* ─── Main Component ─── */
export default function TimelineScrollMobile({ coursesRaw }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [chartsOpen, setChartsOpen] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse course data
  const courses = useMemo(() => parseCourses(coursesRaw), [coursesRaw]);
  const grouped = useMemo(() => groupBySemester(courses), [courses]);
  const semGPA = useMemo(() => computeSemesterGPA(courses), [courses]);
  const cumGPA = useMemo(() => computeCumulativeGPA(courses), [courses]);

  // IntersectionObserver for progress dots
  useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveIdx(idx);
          }
        }
      },
      {
        root: containerRef.current,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [grouped]);

  const scrollToSection = useCallback((idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="m-tl-root" ref={containerRef}>
      {/* Progress dots */}
      <nav className="m-tl-progress">
        {SemesterOrder.map((sem, i) => (
          <button
            key={sem}
            className={`m-tl-dot${i === activeIdx ? ' active' : ''}`}
            onClick={() => scrollToSection(i)}
            aria-label={`Go to ${sem}`}
          />
        ))}
      </nav>

      {/* Semester sections */}
      <div className="m-tl-sections">
        {SemesterOrder.map((sem, i) => {
          const courses = grouped[sem] || [];
          const projects = SEM_PROJECT_ITEMS[sem] || [];

          return (
            <section
              key={sem}
              className="m-tl-section"
              ref={(el) => { sectionRefs.current[i] = el; }}
            >
              {/* Header */}
              <div className="m-tl-hdr">{sem} — <span style={{ color: 'var(--foam)' }}>{SEM_LABELS[i]}</span></div>

              {/* Narrative */}
              <p className="m-tl-narrative">{SEM_NARRATIVES[i]}</p>

              {/* Module list */}
              {courses.length > 0 && (
                <div className="m-tl-mods">
                  {courses.map((c) => (
                    <ModuleCard key={c.Name} course={c} />
                  ))}
                </div>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <div className="m-tl-projs">
                  <div className="m-tl-projs-hdr">Projects</div>
                  {projects.map((p) => (
                    <div key={p} className="m-tl-proj">{p}</div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Charts FAB */}
      <button
        className="m-tl-fab"
        onClick={() => setChartsOpen(true)}
        aria-label="View stats charts"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="10" width="3" height="6" rx="1" fill="var(--pine)" opacity="0.8"/>
          <rect x="7.5" y="6" width="3" height="10" rx="1" fill="var(--foam)" opacity="0.8"/>
          <rect x="13" y="3" width="3" height="13" rx="1" fill="var(--iris)" opacity="0.8"/>
        </svg>
      </button>

      {/* Charts bottom sheet */}
      <ChartsSheet activeIdx={activeIdx} gpaData={semGPA} cumGpaData={cumGPA} open={chartsOpen} onClose={() => setChartsOpen(false)} />
    </div>
  );
}
