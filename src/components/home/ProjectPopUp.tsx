import {
	TrendingUp,
	Github,
	Layers,
	X,
	Code2,
	Database,
	LucideIcon,
} from "lucide-react";
import { createStyles } from "@/app/theme";
import Link from "next/link";

type ProjectType = {
	id: string;
	title: string;
	description: string;
    link?: string;
	type: string;
	duration: string;
	status: string;
	tech: string[];
	details: {
		overview: string;
		architecture?: string[];
		projects?: string[];
		technical?: string[];
		research?: string[];
		results?: string[];
	};
};

const ProjectModal = ({
    project,
    onClose,
}: {
    project: ProjectType;
    onClose: () => void;
}) => {
    if (!project) return null;
    if (!project.id) return null;

    const styles = createStyles();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <div>
                            <h2 className={styles.typography.h3}>{project.title}</h2>
                            <span className={styles.badges.primary}>{project.type}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className={`${styles.buttons.ghost} p-2`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Overview */}
                    <section className="mb-8">
                        <h3 className={styles.typography.h4}>Overview</h3>
                        <p className={`${styles.typography.body} mb-4`}>
                            {project.details.overview}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, index) => (
                                <span key={index} className={styles.tags.default}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Architecture */}
                    {project.details.architecture && (
                        <section className="mb-8">
                            <h3
                                className={`${styles.typography.h4} flex items-center mb-4`}
                            >
                                <Layers className="w-5 h-5 mr-2 text-sky-600" />
                                Architecture & Design
                            </h3>
                            <div className="space-y-3">
                                {project.details.architecture.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={styles.utilities.dotPrimary}></div>
                                        <span className={styles.typography.body}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Technical Implementation */}
                    {project.details.technical && (
                        <section className="mb-8">
                            <h3
                                className={`${styles.typography.h4} flex items-center mb-4`}
                            >
                                <Code2 className="w-5 h-5 mr-2 text-sky-600" />
                                Technical Implementation
                            </h3>
                            <div className="space-y-3">
                                {project.details.technical.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={styles.utilities.dotPrimary}></div>
                                        <span className={styles.typography.body}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Research & Methodology */}
                    {project.details.research && (
                        <section className="mb-8">
                            <h3
                                className={`${styles.typography.h4} flex items-center mb-4`}
                            >
                                <Database className="w-5 h-5 mr-2 text-sky-600" />
                                Research & Methodology
                            </h3>
                            <div className="space-y-3">
                                {project.details.research.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={styles.utilities.dotSuccess}></div>
                                        <span className={styles.typography.body}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Results & Learnings */}
                    {project.details.results && (
                        <section className="mb-8">
                            <h3
                                className={`${styles.typography.h4} flex items-center mb-4`}
                            >
                                <TrendingUp className="w-5 h-5 mr-2 text-sky-600" />
                                Results & Learnings
                            </h3>
                            <div className="space-y-3">
                                {project.details.results.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={styles.utilities.dotSuccess}></div>
                                        <span className={styles.typography.body}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                        {project.link && (
                            <Link href={project.link} passHref>
                              <button className={styles.buttons.primary}>
                                <Github className="w-5 h-5 mr-2" />
                                View Code
                              </button>
                            </Link>
                        )}
                        {/*<button className={styles.buttons.secondary}>
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Live Demo
                        </button>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
