import Papa from 'papaparse';

export interface CourseRow {
  Name: string;
  ModuleCode: string;
  Semester: string;
  Title: string;
  Grade: string;
  Degree: 'BBA' | 'BZA' | 'Both';
  ModuleCredit: string;
  Description: string;
  Review: string;
}

export const SemesterOrder: string[] = [
  'Y1S1', 'Y1S2', 'Y2S1', 'Y2S2', 'Y3S1', 'Y3S2', 'Y4S1', 'Y4S2',
];

const CATEGORY_MAP: Record<string, string> = {
  CS: 'Computer Science',
  BT: 'Business Analytics',
  FIN: 'Quant Finance',
  MA: 'Mathematics',
  ST: 'Mathematics',
  BSP: 'Business Core',
  ACC: 'Business Core',
  IS: 'Business Core',
  MKT: 'Business Core',
  MNO: 'Business Core',
  DAO: 'Business Core',
  UTC: 'Business Core',
};

export function parseCourses(csvRaw: string): CourseRow[] {
  const headerMap: Record<string, string> = {
    'Name': 'Name',
    'Module Code': 'ModuleCode',
    'Semester': 'Semester',
    'Title': 'Title',
    'Grade': 'Grade',
    'BBA / BZA': 'Degree',
    'Module Credit': 'ModuleCredit',
    'Description': 'Description',
    'Review': 'Review',
  };

  const result = Papa.parse<CourseRow>(csvRaw, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => headerMap[h.trim()] || h.trim().replace(/\s+/g, ''),
  });

  return result.data.filter(
    (row) => row.ModuleCode && row.ModuleCode.trim() !== '' && row.Grade && row.Grade.trim() !== ''
  );
}

export function groupBySemester(courses: CourseRow[]): Record<string, CourseRow[]> {
  const groups: Record<string, CourseRow[]> = {};
  for (const sem of SemesterOrder) {
    groups[sem] = [];
  }
  for (const course of courses) {
    const sem = course.Semester?.trim();
    if (sem && groups[sem] !== undefined) {
      groups[sem].push(course);
    }
  }
  return groups;
}

export function groupByCategory(courses: CourseRow[]): Record<string, CourseRow[]> {
  const groups: Record<string, CourseRow[]> = {
    'Computer Science': [],
    'Business Analytics': [],
    'Quant Finance': [],
    'Mathematics': [],
    'Business Core': [],
  };

  for (const course of courses) {
    const code = course.ModuleCode.trim();
    const prefixMatch = code.match(/^[A-Za-z]+/);
    const prefix = prefixMatch ? prefixMatch[0].toUpperCase() : '';
    const category = CATEGORY_MAP[prefix] || 'Business Core';
    if (groups[category]) {
      groups[category].push(course);
    } else {
      groups['Business Core'].push(course);
    }
  }

  return groups;
}

export function gradeClass(grade: string): string {
  if (grade === 'A+') return 'grade-ap';
  if (grade === 'A' || grade === 'A-') return 'grade-a';
  if (grade === 'B+' || grade === 'B') return 'grade-bp';
  if (grade === 'S' || grade === 'CS') return 'grade-s';
  return 'grade-s';
}

/**
 * Build the reviews map from parsed course data.
 * Uses the "Name" field (module code like CS2040) as key, "Review" field as value.
 * Only includes courses that have a non-empty review.
 */
export function buildReviews(courses: CourseRow[]): Record<string, string> {
  const reviews: Record<string, string> = {};
  for (const course of courses) {
    if (course.Review && course.Review.trim() !== '') {
      reviews[course.Name.trim()] = course.Review.trim();
    }
  }
  return reviews;
}

// ─── GPA Calculation ──────────────────────────────────────────

const GRADE_POINTS: Record<string, number> = {
  'A+': 5.0,
  'A': 5.0,
  'A-': 4.5,
  'B+': 4.0,
  'B': 3.5,
};

/**
 * Compute weighted GPA per semester from course data.
 * Returns an array of GPA values aligned to SemesterOrder.
 * Grades not in GRADE_POINTS (e.g. CS, S) are excluded from calculation.
 */
export function computeSemesterGPA(courses: CourseRow[]): number[] {
  const grouped = groupBySemester(courses);
  return SemesterOrder.map(sem => {
    const semCourses = grouped[sem] || [];
    let totalPoints = 0;
    let totalMCs = 0;
    for (const c of semCourses) {
      const grade = c.Grade.trim();
      const mc = parseInt(c.ModuleCredit, 10) || 0;
      if (GRADE_POINTS[grade] !== undefined && mc > 0) {
        totalPoints += GRADE_POINTS[grade] * mc;
        totalMCs += mc;
      }
    }
    return totalMCs > 0 ? totalPoints / totalMCs : 0;
  });
}

/**
 * Compute cumulative weighted GPA up to each semester.
 * Returns an array aligned to SemesterOrder where each value is the
 * cumulative GPA from Y1S1 through that semester.
 */
export function computeCumulativeGPA(courses: CourseRow[]): number[] {
  const grouped = groupBySemester(courses);
  let runningPoints = 0;
  let runningMCs = 0;
  return SemesterOrder.map(sem => {
    const semCourses = grouped[sem] || [];
    for (const c of semCourses) {
      const grade = c.Grade.trim();
      const mc = parseInt(c.ModuleCredit, 10) || 0;
      if (GRADE_POINTS[grade] !== undefined && mc > 0) {
        runningPoints += GRADE_POINTS[grade] * mc;
        runningMCs += mc;
      }
    }
    return runningMCs > 0 ? runningPoints / runningMCs : 0;
  });
}
