//
// "use client";
//
// import React, { useState, useEffect } from "react";
// import {
//   ChevronRight,
//   TrendingUp,
//   Code2,
//   Database,
//   Brain,
//   Mail,
//   Phone,
//   Linkedin,
//   Github,
//   ExternalLink,
//   ArrowRight,
// } from "lucide-react";
//
// const Portfolio = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);
//
//   // Centralized styling system
//   const styles = {
//     // Layout
//     container: "max-w-7xl mx-auto px-6",
//     section: "py-20",
//     grid: {
//       two: "grid md:grid-cols-2 gap-8",
//       three: "grid lg:grid-cols-3 gap-12",
//     },
//
//     // Cards
//     card: {
//       base: "bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300",
//       interactive:
//         "group relative bg-white border border-slate-200 rounded-lg p-6 hover:shadow-xl transition-all duration-500 hover:border-sky-300",
//     },
//
//     // Typography
//     heading: {
//       h1: "text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight",
//       h2: "text-3xl lg:text-4xl font-bold text-slate-900 mb-4",
//       h3: "text-2xl font-bold text-slate-900 mb-6",
//       h4: "text-xl font-semibold text-slate-900",
//     },
//     text: {
//       large: "text-xl text-slate-600 leading-relaxed",
//       body: "text-slate-700",
//       muted: "text-slate-600",
//     },
//
//     // Buttons
//     button: {
//       primary:
//         "inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors duration-300 group",
//       secondary:
//         "inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors duration-300",
//     },
//
//     // Interactive elements
//     link: {
//       primary: "text-sky-600 hover:text-sky-700 transition-colors duration-300",
//       nav: "text-slate-600 hover:text-sky-600 transition-colors duration-300",
//       social:
//         "text-slate-600 hover:text-sky-600 transition-colors duration-300",
//     },
//
//     // Status indicators
//     badge: "px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full",
//     tag: "px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded font-medium",
//     dot: "w-2 h-2 bg-sky-600 rounded-full mr-3",
//   };
//
//   const ProjectCard = ({ title, description, tech, type, delay = 0 }) => (
//     <div
//       className={styles.card.interactive}
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
//       <div className="relative z-10">
//         <div className="flex items-start justify-between mb-4">
//           <h3
//             className={`${styles.heading.h4} group-hover:text-sky-600 transition-colors duration-300`}
//           >
//             {title}
//           </h3>
//           <span className={styles.badge}>{type}</span>
//         </div>
//         <p className={`${styles.text.muted} mb-4 leading-relaxed`}>
//           {description}
//         </p>
//         <div className="flex flex-wrap gap-2 mb-4">
//           {tech.map((item, index) => (
//             <span key={index} className={styles.tag}>
//               {item}
//             </span>
//           ))}
//         </div>
//         <div className={`flex items-center ${styles.link.primary} font-medium`}>
//           <span className="mr-2">View Details</span>
//           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//         </div>
//       </div>
//     </div>
//   );
//
//   const MetricCard = ({ value, label, icon: Icon }) => (
//     <div className={styles.card.base}>
//       <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-100 rounded-lg mb-4">
//         <Icon className="w-6 h-6 text-sky-600" />
//       </div>
//       <div className="text-2xl font-bold text-slate-900 mb-2">{value}</div>
//       <div className={styles.text.muted}>{label}</div>
//     </div>
//   );
//
//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Subtle Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div
//           className="absolute w-96 h-96 bg-gradient-to-br from-sky-200/10 to-transparent rounded-full blur-3xl transition-all duration-1000"
//           style={{
//             left: mousePosition.x - 200,
//             top: mousePosition.y - 200,
//           }}
//         />
//       </div>
//
//       {/* Navigation */}
//       <nav className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0">
//         <div className={`${styles.container} py-4`}>
//           <div className="flex items-center justify-between">
//             <div className="text-xl font-bold text-slate-900">Your Name</div>
//             <div className="hidden md:flex items-center space-x-8">
//               <a href="#home" className={styles.link.primary}>
//                 Home
//               </a>
//               <a href="#experience" className={styles.link.nav}>
//                 Experience
//               </a>
//               <a href="#projects" className={styles.link.nav}>
//                 Projects
//               </a>
//               <a href="#journal" className={styles.link.nav}>
//                 Journal
//               </a>
//               <a href="#contact" className={styles.link.nav}>
//                 Contact
//               </a>
//             </div>
//             <div className="flex items-center space-x-4">
//               <a
//                 href="mailto:your.email@example.com"
//                 className={styles.link.social}
//               >
//                 <Mail className="w-5 h-5" />
//               </a>
//               <a
//                 href="https://linkedin.com/in/yourprofile"
//                 className={styles.link.social}
//               >
//                 <Linkedin className="w-5 h-5" />
//               </a>
//               <a
//                 href="https://github.com/yourprofile"
//                 className={styles.link.social}
//               >
//                 <Github className="w-5 h-5" />
//               </a>
//             </div>
//           </div>
//         </div>
//       </nav>
//
//       {/* Hero Section */}
//       <section id="home" className={`relative ${styles.section} lg:py-32`}>
//         <div className={styles.container}>
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <div className="inline-flex items-center px-4 py-2 bg-sky-50 text-sky-700 rounded-full text-sm mb-6">
//                 <TrendingUp className="w-4 h-4 mr-2" />
//                 Seeking Quantitative Finance Opportunities
//               </div>
//               <h1 className={styles.heading.h1}>Hi, Im [Your Name]</h1>
//               <p className={`${styles.text.large} mb-8`}>
//                 Business Analytics student at NUS with experience in AI
//                 development and algorithmic trading. I enjoy working with data
//                 and building systems that solve real problems.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button className={styles.button.primary}>
//                   View My Work
//                   <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
//                 </button>
//                 <button className={styles.button.secondary}>
//                   Resume
//                   <ExternalLink className="w-5 h-5 ml-2" />
//                 </button>
//               </div>
//             </div>
//             <div className="relative">
//               {/* Profile photo placeholder */}
//               <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
//                 <div className="text-center mb-6">
//                   <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
//                     <span className="text-slate-500 text-sm">Photo</span>
//                   </div>
//                   <h3 className={styles.heading.h4}>Your Name</h3>
//                   <p className={styles.text.muted}>NUS Business Analytics</p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <MetricCard
//                     value="Y3"
//                     label="Current Year"
//                     icon={TrendingUp}
//                   />
//                   <MetricCard value="SAP" label="AI Experience" icon={Brain} />
//                   <MetricCard
//                     value="Full-Stack"
//                     label="Trading Bot"
//                     icon={Code2}
//                   />
//                   <MetricCard
//                     value="Docker"
//                     label="Deployment"
//                     icon={Database}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//
//       {/* Projects Section */}
//       <section className={`${styles.section} bg-white`}>
//         <div className={styles.container}>
//           <div className="text-center mb-16">
//             <h2 className={styles.heading.h2}>Recent Work</h2>
//             <p className={`${styles.text.large} max-w-3xl mx-auto`}>
//               What Ive been working on lately
//             </p>
//           </div>
//
//           <div className={styles.grid.two}>
//             <ProjectCard
//               title="Trading Bot Development"
//               description="Built a trading system over the summer with data processing, risk management, and backtesting. Learned a lot about market dynamics and system architecture."
//               tech={[
//                 "Python",
//                 "Docker",
//                 "PostgreSQL",
//                 "Market Data",
//                 "Risk Management",
//               ]}
//               type="Personal Project"
//               delay={0}
//             />
//
//             <ProjectCard
//               title="AI Development at SAP"
//               description="Worked on frontend and backend development for AI applications during my Y2 summer. Gained experience with LLMs and building user interfaces for business applications."
//               tech={[
//                 "React",
//                 "TypeScript",
//                 "Node.js",
//                 "LLMs",
//                 "API Integration",
//               ]}
//               type="Internship"
//               delay={200}
//             />
//           </div>
//         </div>
//       </section>
//
//       {/* Skills & Background */}
//       <section className={`${styles.section} bg-slate-50`}>
//         <div className={styles.container}>
//           <div className={styles.grid.three}>
//             <div>
//               <h3 className={styles.heading.h3}>Technical Skills</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center">
//                   <div className={styles.dot}></div>
//                   <span className={styles.text.body}>
//                     Python, TypeScript, React
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className={styles.dot}></div>
//                   <span className={styles.text.body}>
//                     Docker, PostgreSQL, MongoDB
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className={styles.dot}></div>
//                   <span className={styles.text.body}>
//                     Financial APIs, Market Data
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className={styles.dot}></div>
//                   <span className={styles.text.body}>
//                     Machine Learning, LLMs
//                   </span>
//                 </div>
//               </div>
//             </div>
//
//             <div>
//               <h3 className={styles.heading.h3}>Areas of Interest</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
//                   <span className={styles.text.body}>Quantitative Trading</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
//                   <span className={styles.text.body}>Risk Management</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
//                   <span className={styles.text.body}>
//                     Financial Data Analysis
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
//                   <span className={styles.text.body}>System Architecture</span>
//                 </div>
//               </div>
//             </div>
//
//             <div>
//               <h3 className={styles.heading.h3}>Currently</h3>
//               <div className={`${styles.card.base} p-6`}>
//                 <p className={`${styles.text.body} mb-4`}>
//                   Final year student looking for opportunities in quantitative
//                   finance and algorithmic trading.
//                 </p>
//                 <div className="flex flex-col space-y-3">
//                   <a
//                     href="mailto:your.email@example.com"
//                     className={`inline-flex items-center ${styles.link.primary}`}
//                   >
//                     <Mail className="w-4 h-4 mr-2" />
//                     your.email@example.com
//                   </a>
//                   <a
//                     href="tel:+65XXXXXXXX"
//                     className={`inline-flex items-center ${styles.link.primary}`}
//                   >
//                     <Phone className="w-4 h-4 mr-2" />
//                     +65 XXXX XXXX
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//
//       {/* Footer */}
//       <footer className="bg-slate-900 text-white py-12">
//         <div className={styles.container}>
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-6 md:mb-0">
//               <h3 className="text-xl font-bold mb-2">Get in Touch</h3>
//               <p className="text-slate-400">
//                 Always interested in discussing quantitative finance and new
//                 opportunities
//               </p>
//             </div>
//             <div className="flex items-center space-x-6">
//               <a
//                 href="mailto:your.email@example.com"
//                 className="text-slate-400 hover:text-white transition-colors duration-300"
//               >
//                 <Mail className="w-6 h-6" />
//               </a>
//               <a
//                 href="https://linkedin.com/in/yourprofile"
//                 className="text-slate-400 hover:text-white transition-colors duration-300"
//               >
//                 <Linkedin className="w-6 h-6" />
//               </a>
//               <a
//                 href="https://github.com/yourprofile"
//                 className="text-slate-400 hover:text-white transition-colors duration-300"
//               >
//                 <Github className="w-6 h-6" />
//               </a>
//               <a
//                 href="tel:+65XXXXXXXX"
//                 className="text-slate-400 hover:text-white transition-colors duration-300"
//               >
//                 <Phone className="w-6 h-6" />
//               </a>
//             </div>
//           </div>
//           <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
//             <p>&copy; 2025 Your Name. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };
//
// export default Portfolio;
