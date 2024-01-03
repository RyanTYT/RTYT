export interface NUSmod {
    name: string | null;
    moduleCode: string | null;
    semester: string | null;
    title: string | null;
    description: string | null;
    review: string | null;
    grade: string | null;
    type: string | null;
    moduleCredit: number | null;
}

export interface NUSmods {
    modules: NUSmod[];
}

export const gradeToGPA: Map<string, number> = new Map<string, number>([
    ["A+", 5.0],
    ["A", 5.0],
    ["A-", 4.5],
    ["B+", 4.0],
    ["B", 3.5],
    ["B-", 3.0],
    ["C+", 2.5],
    ["C", 2.0],
    ["D+", 1.5],
    ["D", 1.0],
    ["F", 0.0],
]);
