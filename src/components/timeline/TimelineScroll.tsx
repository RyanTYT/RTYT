import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import {
  parseCourses,
  groupBySemester,
  SemesterOrder,
  gradeClass,
  computeSemesterGPA,
  computeCumulativeGPA,
} from '../../lib/courses';

interface Props {
  coursesRaw: string;
}

const SEM_LABELS: Record<string, string> = {
  Y1S1: 'Aug–Dec 2021', Y1S2: 'Jan–May 2022',
  Y2S1: 'Aug–Dec 2022', Y2S2: 'Jan–May 2023',
  Y3S1: 'Aug–Dec 2023', Y3S2: 'Jan–May 2024',
  Y4S1: 'Aug–Dec 2024', Y4S2: 'Jan–May 2025',
};

const SEM_HAPPINESS = [8, 7, 7, 5, 6, 6, 8, 9];
const SEM_PROJECTS_EFFORT = [0, 1, 0, 1, 0, 2, 2, 3];

const SEM_NARRATIVE: Record<string, string> = {
  Y1S1: 'Explored some basic Analytics + First Introduction to Vim and NeoVim',
  Y1S2: 'Orbital and Overloading',
  Y2S1: 'First B+ because I read the deadline wrong. Big LOLs.',
  Y2S2: 'Intermediary Semester for more interesting modules later on',
  Y3S1: 'Nerfed by ATAP Internship alongside taking courses - got Top Student for Analytics for Capital Market Trading',
  Y3S2: 'Stopped caring about grades almost completely',
  Y4S1: "Explored more interesting fundamental CS courses that are unnecessary for my course but fundamental for Computing",
  Y4S2: 'Liked concurrency so overloaded to learn more about it',
};
const SEM_PROJECTS: Record<string, string[]> = {
  Y1S1: [],
  Y1S2: ['Orbital — full-stack web app'],
  Y2S1: [],
  Y2S2: ['Portfolio Site v1'],
  Y3S1: [],
  Y3S2: ['LoveBets', 'Healthhack'],
  Y4S1: ['Trading Bot', 'Portfolio Site v2'],
  Y4S2: ['Multi-currency IBKR', 'LLM Research Pipeline', 'Portfolio Site v3'],
};

function drawGraphSVG(data: number[], min: number, max: number, color: string, activeIdx: number): string {
  const w = 220, h = 60, pad = 6, n = data.length;
  const pts = data.map((v, i) => ({
    x: pad + (i / (n - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / (max - min)) * (h - pad * 2),
  }));

  let s = `<path d="M${pts[0].x},${h - pad} ${pts.map(p => `L${p.x},${p.y}`).join(' ')} L${pts[n - 1].x},${h - pad} Z" fill="${color}" opacity="0.06"/>`;
  s += `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + p.x + ',' + p.y).join(' ')}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
  pts.forEach((p, i) => {
    const act = i === activeIdx;
    s += `<circle cx="${p.x}" cy="${p.y}" r="${act ? 4.5 : 2}" fill="${act ? color : 'var(--b)'}" stroke="${color}" stroke-width="${act ? 2 : 1}"/>`;
  });
  const ap = pts[activeIdx];
  const val = Number.isInteger(data[activeIdx]) ? data[activeIdx].toString() : data[activeIdx].toFixed(2);
  s += `<text x="${ap.x}" y="${Math.max(ap.y - 8, 10)}" font-size="9" fill="${color}" text-anchor="middle" font-family="var(--f)" font-weight="600">${val}</text>`;
  return s;
}

export default function TimelineScroll({ coursesRaw }: Props) {
  const courses = useMemo(() => parseCourses(coursesRaw), [coursesRaw]);
  const bySemester = useMemo(() => groupBySemester(courses), [courses]);
  const SEM_GPA = useMemo(() => computeSemesterGPA(courses), [courses]);
  const CUM_GPA = useMemo(() => computeCumulativeGPA(courses), [courses]);

  const activeSemesters = useMemo(
    () => SemesterOrder.filter((sem) => bySemester[sem]?.length > 0),
    [bySemester]
  );

  const rightRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const sectionLayoutsRef = useRef<{ top: number; height: number }[]>([]);
  const cardElementsRef = useRef<HTMLElement[]>([]);

  const scrollMetricsRef = useRef({
    currentProgress: 0,
    targetProgress: 0,
    currentScrollTop: 0,
    targetScrollTop: 0,
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [railExpanded, setRailExpanded] = useState(false);

  const measureSections = useCallback(() => {
    const el = rightRef.current;
    if (!el) return;
    const sections = el.querySelectorAll('.tl-section');
    cardElementsRef.current = Array.from(sections) as HTMLElement[];
    sectionLayoutsRef.current = cardElementsRef.current.map((sec) => ({
      top: sec.offsetTop,
      height: sec.offsetHeight,
    }));
  }, []);

  useEffect(() => {
    measureSections();
    window.addEventListener('resize', measureSections);
    return () => window.removeEventListener('resize', measureSections);
  }, [measureSections, activeSemesters]);

  // Unified animation framework loop
  useEffect(() => {
    let animFrameId: number;

    const updateLoop = () => {
      const m = scrollMetricsRef.current;
      const lerpFactor = 1; // Adjusted slightly higher for snap-to-scroll responsiveness
      
      m.currentProgress += (m.targetProgress - m.currentProgress) * lerpFactor;
      m.currentScrollTop += (m.targetScrollTop - m.currentScrollTop) * lerpFactor;

      // 1. Left panel parallax
      if (leftPanelRef.current) {
        leftPanelRef.current.style.transform = `translate3d(0, ${m.currentProgress * -20}px, 0)`;
      }

      const el = rightRef.current;
      if (el && sectionLayoutsRef.current.length > 0) {
        const viewportCenterOffset = m.currentScrollTop + el.clientHeight * 0.4;
        let determinedActiveIdx = 0;

        // 2. Direct dynamic update for individual card styles based on absolute pixel scroll points
        cardElementsRef.current.forEach((card, idx) => {
          const layout = sectionLayoutsRef.current[idx];
          if (!layout) return;

          // Compute how far the card center is from our focal active line
          const cardCenter = layout.top + layout.height / 2;
          const focusY = m.currentScrollTop + el.clientHeight * 0.5;
          const distance = Math.abs(focusY - cardCenter);

          // Continuous granular calculations instead of stepped array indices
          const normalizedDist = Math.min(1, distance / (el.clientHeight * 0.6));
          const scale = 1.05 - (normalizedDist * 0.2); // Smooth range from 1.05 down to 0.85
          const opacity = 1.0 - (normalizedDist * 0.7); // Smooth range from 1.0 down to 0.3

          card.style.transform = `scale3d(${scale}, ${scale}, 1)`;
          card.style.opacity = opacity.toString();

          // Standard active boundary checker
          if (viewportCenterOffset >= layout.top) {
            determinedActiveIdx = idx;
          }
        });

        // 3. Batch heavy structural state updates only when necessary
        const shouldExpand = m.currentScrollTop > 10;
        setRailExpanded((prev) => (prev !== shouldExpand ? shouldExpand : prev));
        setActiveIdx((prev) => (prev !== determinedActiveIdx ? determinedActiveIdx : prev));
      }

      animFrameId = window.requestAnimationFrame(updateLoop);
    };

    animFrameId = window.requestAnimationFrame(updateLoop);
    return () => window.cancelAnimationFrame(animFrameId);
  }, []);

  const handleScroll = useCallback(() => {
    const el = rightRef.current;
    if (!el) return;

    const sTop = el.scrollTop;
    const scrollMax = el.scrollHeight - el.clientHeight;
    
    scrollMetricsRef.current.targetScrollTop = sTop;
    scrollMetricsRef.current.targetProgress = scrollMax > 0 ? sTop / scrollMax : 0;
  }, []);

  useEffect(() => {
    const el = rightRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToSection = (idx: number) => {
    const el = rightRef.current;
    if (!el) return;
    const sections = el.querySelectorAll('.tl-section');
    sections[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const total = activeSemesters.length;
  const lineWidth = railExpanded ? 14 : 3;
  const midWidth = railExpanded ? 200 : 80;
  const fillPos = railExpanded ? 50 : (6 + (activeIdx / Math.max(1, total - 1)) * 88);
  const lineBackground = railExpanded
    ? `linear-gradient(180deg, rgba(156,207,216,0.9) 0%, rgba(156,207,216,1) ${fillPos}%, rgba(64,61,82,0.4) ${fillPos + 2}%, rgba(64,61,82,0.2) 100%)`
    : 'var(--hm)';

  return (
    <div className="tl-body">
      {/* Left panel — graphs */}
      <div 
        className="tl-left" 
        ref={leftPanelRef}
        style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
      >
        <div className="tl-left-sem">
          {activeSemesters[activeIdx]} · {SEM_LABELS[activeSemesters[activeIdx]] ?? ''}
        </div>

        {/* GPA Graph */}
        <div className="tl-graph-card">
          <div className="tl-graph-hdr">
            <div className="tl-graph-dot tl-graph-dot-foam" />
            <span className="tl-graph-label">GPA</span>
            <span className="tl-graph-val tl-graph-val-foam">
              {SEM_GPA[activeIdx]?.toFixed(2) ?? '—'}
            </span>
          </div>
          <svg className="tl-graph-svg" viewBox="0 0 220 60" preserveAspectRatio="none"
            dangerouslySetInnerHTML={{ __html: drawGraphSVG(SEM_GPA, 3.5, 5.0, '#9ccfd8', activeIdx) }}
          />
        </div>

        {/* Cumulative GPA Graph */}
        <div className="tl-graph-card">
          <div className="tl-graph-hdr">
            <div className="tl-graph-dot tl-graph-dot-pine" />
            <span className="tl-graph-label">Cumulative GPA</span>
            <span className="tl-graph-val tl-graph-val-pine">
              {CUM_GPA[activeIdx]?.toFixed(2) ?? '—'}
            </span>
          </div>
          <svg className="tl-graph-svg" viewBox="0 0 220 60" preserveAspectRatio="none"
            dangerouslySetInnerHTML={{ __html: drawGraphSVG(CUM_GPA, 3.5, 5.0, '#31748f', activeIdx) }}
          />
        </div>

        {/* Fulfillment Graph */}
        <div className="tl-graph-card">
          <div className="tl-graph-hdr">
            <div className="tl-graph-dot tl-graph-dot-gold" />
            <span className="tl-graph-label">Fulfillment</span>
            <span className="tl-graph-val tl-graph-val-gold">
              {SEM_HAPPINESS[activeIdx]}/10
            </span>
          </div>
          <svg className="tl-graph-svg" viewBox="0 0 220 60" preserveAspectRatio="none"
            dangerouslySetInnerHTML={{ __html: drawGraphSVG(SEM_HAPPINESS, 0, 10, '#f6c177', activeIdx) }}
          />
        </div>

        {/* Projects Graph */}
        <div className="tl-graph-card">
          <div className="tl-graph-hdr">
            <div className="tl-graph-dot tl-graph-dot-iris" />
            <span className="tl-graph-label">Projects</span>
            <span className="tl-graph-val tl-graph-val-iris">
              {SEM_PROJECTS_EFFORT[activeIdx]}/10
            </span>
          </div>
          <svg className="tl-graph-svg" viewBox="0 0 220 60" preserveAspectRatio="none"
            dangerouslySetInnerHTML={{ __html: drawGraphSVG(SEM_PROJECTS_EFFORT, 0, 10, '#c4a7e7', activeIdx) }}
          />
        </div>
      </div>

      {/* Middle rail — expanding railway */}
      <div className="tl-mid" style={{ width: `${midWidth}px` }}>
        <div
          className="tl-mid-line"
          style={{
            width: `${lineWidth}px`,
            borderRadius: `${lineWidth / 2}px`,
            background: lineBackground,
          }}
        />
        {activeSemesters.map((sem, idx) => {
          const distFromActive = idx - activeIdx;
          const topPct = railExpanded
            ? 50 + distFromActive * 40
            : 6 + (idx / Math.max(1, total - 1)) * 88;

          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;
          const isVisible = topPct > -20 && topPct < 120;
          const dotSize = isActive ? 32 : 24;

          let dotStyle: React.CSSProperties = {
            position: 'absolute',
            top: `${topPct}%`,
            left: '50%',
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: '50%',
            transform: 'translate3d(-50%, -50%, 0)',
            opacity: isVisible ? 1 : 0,
            cursor: 'pointer',
            transition: 'top .4s ease, width .3s, height .3s, background .3s, border-color .3s, opacity .3s',
            zIndex: 2,
            border: '3px solid var(--b)',
            background: 'var(--hm)',
          };

          if (isActive) {
            dotStyle = {
              ...dotStyle,
              background: 'var(--foam)',
              borderColor: 'rgba(156,207,216,0.6)',
            };
          } else if (isPast) {
            dotStyle = {
              ...dotStyle,
              background: 'rgba(156,207,216,0.7)',
              borderColor: 'rgba(156,207,216,0.3)',
            };
          }

          const labelLeft = railExpanded ? 'calc(50% + 28px)' : 'calc(50% + 20px)';
          const labelVisible = topPct > -10 && topPct < 110;

          return (
            <div key={sem}>
              <div style={dotStyle} onClick={() => scrollToSection(idx)} />
              <div
                className="tl-mid-yr"
                style={{
                  position: 'absolute',
                  top: `${topPct}%`,
                  left: labelLeft,
                  transform: 'translate3d(0, -50%, 0)',
                  fontSize: railExpanded ? '13px' : '11px',
                  color: isActive ? 'var(--foam)' : 'var(--hh)',
                  opacity: labelVisible ? 1 : 0,
                  whiteSpace: 'nowrap',
                  transition: 'top .4s ease, font-size .3s, opacity .3s, left .4s, color .3s',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {sem}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right panel — scrollable content */}
      <div className="tl-right" ref={rightRef}>
        {activeSemesters.map((sem, idx) => {
          const mods = bySemester[sem];
          const projs = SEM_PROJECTS[sem] || [];

          return (
            <div
              key={sem}
              className="tl-section"
              style={{
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
              }}
            >
              <div className="tl-sec-hdr">
                <div className="tl-sec-title">{sem}</div>
                <div className="tl-sec-sub">{SEM_LABELS[sem]} · {mods.length} modules</div>
              </div>

              <div className="tl-sec-narrative">{SEM_NARRATIVE[sem]}</div>

              <div className="tl-mods">
                {mods.map((course) => (
                  <div key={course.Name} className="tl-mod">
                    <span className="tm-code">{course.Name}</span>
                    <span className="tm-title">{course.Title}</span>
                    <span className={`tm-grade ${gradeClass(course.Grade)}`}>
                      {course.Grade}
                    </span>
                  </div>
                ))}
              </div>

              {projs.length > 0 && (
                <div className="tl-sec-projs">
                  <div className="tl-sec-projs-hdr">Side Projects</div>
                  {projs.map((p, i) => (
                    <div key={i} className="tl-proj-item">{p}</div>
                  ))}
                </div>
              )}

              <div className="tl-sec-metrics">
                <div className="tl-metric">
                  <div className="tl-metric-val tl-metric-val-foam">
                    {SEM_GPA[idx]?.toFixed(2) ?? '—'}
                  </div>
                  <div className="tl-metric-lbl">GPA</div>
                </div>
                <div className="tl-metric">
                  <div className="tl-metric-val tl-metric-val-pine">
                    {CUM_GPA[idx]?.toFixed(2) ?? '—'}
                  </div>
                  <div className="tl-metric-lbl">Cumulative</div>
                </div>
                <div className="tl-metric">
                  <div className="tl-metric-val tl-metric-val-gold">
                    {SEM_HAPPINESS[idx]}/10
                  </div>
                  <div className="tl-metric-lbl">Fulfillment</div>
                </div>
                <div className="tl-metric">
                  <div className="tl-metric-val tl-metric-val-iris">
                    {SEM_PROJECTS_EFFORT[idx]}/10
                  </div>
                  <div className="tl-metric-lbl">Projects</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
