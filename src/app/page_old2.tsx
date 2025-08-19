"use client";
import React, { useState, useEffect } from "react";
import {
	ThemeProvider,
	createTheme,
	CssBaseline,
	Box,
	Container,
	Typography,
	Button,
	Card,
	CardContent,
	Grid,
	Chip,
	IconButton,
	AppBar,
	Toolbar,
	Avatar,
	Paper,
	Stack,
	Divider,
} from "@mui/material";
import {
	ChevronRight,
	TrendingUp,
	Code2,
	Database,
	Brain,
	Mail,
	Phone,
	Linkedin,
	Github,
	ExternalLink,
	ArrowRight,
} from "lucide-react";

// Centralized Theme Configuration
const quantTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#0ea5e9", // Sky blue
			dark: "#0284c7",
			light: "#38bdf8",
		},
		secondary: {
			main: "#0f172a", // Deep slate
			dark: "#020617",
			light: "#1e293b",
		},
		success: {
			main: "#10b981", // Emerald
		},
		warning: {
			main: "#f59e0b", // Amber
		},
		background: {
			default: "#f8fafc", // Slate-50
			paper: "#ffffff",
		},
		text: {
			primary: "#0f172a", // Slate-900
			secondary: "#64748b", // Slate-500
		},
		grey: {
			100: "#f1f5f9", // Slate-100
			200: "#e2e8f0", // Slate-200
			300: "#cbd5e1", // Slate-300
			400: "#94a3b8", // Slate-400
			500: "#64748b", // Slate-500
			600: "#475569", // Slate-600
		},
	},
	typography: {
		fontFamily: [
			"Inter",
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
		].join(","),
		h1: {
			fontSize: "3rem",
			fontWeight: 700,
			lineHeight: 1.2,
			"@media (min-width:1024px)": {
				fontSize: "4rem",
			},
		},
		h2: {
			fontSize: "2.25rem",
			fontWeight: 700,
			lineHeight: 1.3,
			"@media (min-width:1024px)": {
				fontSize: "2.5rem",
			},
		},
		h3: {
			fontSize: "1.875rem",
			fontWeight: 700,
			lineHeight: 1.3,
		},
		h4: {
			fontSize: "1.25rem",
			fontWeight: 600,
			lineHeight: 1.4,
		},
		body1: {
			fontSize: "1rem",
			lineHeight: 1.6,
		},
		body2: {
			fontSize: "1.25rem",
			lineHeight: 1.6,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: 8,
					padding: "12px 24px",
					fontSize: "1rem",
					fontWeight: 500,
					transition: "all 0.3s ease",
				},
				contained: {
					boxShadow: "none",
					"&:hover": {
						boxShadow: "none",
						transform: "translateY(-1px)",
					},
				},
				outlined: {
					borderWidth: "1px",
					"&:hover": {
						borderWidth: "1px",
						transform: "translateY(-1px)",
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					boxShadow:
						"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
					transition: "all 0.3s ease",
					"&:hover": {
						boxShadow:
							"0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
						transform: "translateY(-2px)",
					},
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 6,
					fontWeight: 500,
					fontSize: "0.75rem",
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "rgba(255, 255, 255, 0.8)",
					backdropFilter: "blur(8px)",
					boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
					color: "#0f172a",
				},
			},
		},
	},
	spacing: 8,
});

// Custom styled components
const HeroSection = ({ children, ...props }) => (
	<Box
		component="section"
		sx={{
			position: "relative",
			py: { xs: 10, lg: 16 },
			overflow: "hidden",
		}}
		{...props}
	>
		{children}
	</Box>
);

const Section = ({ children, bgcolor = "background.default", ...props }) => (
	<Box
		component="section"
		sx={{
			py: 10,
			bgcolor,
		}}
		{...props}
	>
		{children}
	</Box>
);

const StyledCard = ({ children, interactive = false, ...props }) => (
	<Card
		sx={{
			height: "100%",
			position: "relative",
			...(interactive && {
				"&:hover": {
					"& .card-overlay": {
						opacity: 1,
					},
					"& .card-content": {
						transform: "translateY(-2px)",
					},
				},
			}),
		}}
		{...props}
	>
		{interactive && (
			<Box
				className="card-overlay"
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						"linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, transparent 100%)",
					opacity: 0,
					transition: "opacity 0.3s ease",
					borderRadius: "inherit",
				}}
			/>
		)}
		<CardContent
			className="card-content"
			sx={{
				position: "relative",
				zIndex: 1,
				transition: "transform 0.3s ease",
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{children}
		</CardContent>
	</Card>
);

const Portfolio = () => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const ProjectCard = ({ title, description, tech, type, delay = 0 }) => (
		<StyledCard interactive>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
				mb={2}
			>
				<Typography variant="h4" color="text.primary">
					{title}
				</Typography>
				<Chip label={type} size="small" />
			</Stack>

			<Typography variant="body1" color="text.secondary" mb={3} flexGrow={1}>
				{description}
			</Typography>

			<Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
				{tech.map((item, index) => (
					<Chip
						key={index}
						label={item}
						size="small"
						color="primary"
						variant="outlined"
					/>
				))}
			</Stack>

			<Box
				display="flex"
				alignItems="center"
				color="primary.main"
				fontWeight="medium"
			>
				<Typography variant="body2" color="primary.main" mr={1}>
					View Details
				</Typography>
				<ArrowRight size={16} />
			</Box>
		</StyledCard>
	);

	const MetricCard = ({ value, label, icon: Icon }) => (
		<StyledCard>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				textAlign="center"
			>
				<Box
					sx={{
						width: 48,
						height: 48,
						bgcolor: "primary.light",
						color: "primary.main",
						borderRadius: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						mb: 2,
					}}
				>
					<Icon size={24} />
				</Box>
				<Typography variant="h4" color="text.primary" mb={1}>
					{value}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{label}
				</Typography>
			</Box>
		</StyledCard>
	);

	const SkillItem = ({ children, color = "primary" }) => (
		<Box display="flex" alignItems="center" mb={1.5}>
			<Box
				sx={{
					width: 8,
					height: 8,
					bgcolor: color === "primary" ? "primary.main" : "success.main",
					borderRadius: "50%",
					mr: 1.5,
				}}
			/>
			<Typography variant="body1" color="text.primary">
				{children}
			</Typography>
		</Box>
	);

	return (
		<ThemeProvider theme={quantTheme}>
			<CssBaseline />

			{/* Subtle Background Effect */}
			<Box
				sx={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					pointerEvents: "none",
					zIndex: -1,
				}}
			>
				<Box
					sx={{
						position: "absolute",
						width: 400,
						height: 400,
						background:
							"radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)",
						borderRadius: "50%",
						filter: "blur(40px)",
						transform: `translate(${mousePosition.x - 200}px, ${mousePosition.y - 200}px)`,
						transition: "transform 1s ease",
					}}
				/>
			</Box>

			{/* Navigation */}
			<AppBar position="sticky" elevation={0}>
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, fontWeight: 700 }}
					>
						Your Name
					</Typography>

					<Box
						sx={{
							display: { xs: "none", md: "flex" },
							gap: 4,
							mr: 4,
						}}
					>
						<Button color="primary">Home</Button>
						<Button color="inherit">Experience</Button>
						<Button color="inherit">Projects</Button>
						<Button color="inherit">Journal</Button>
						<Button color="inherit">Contact</Button>
					</Box>

					<Stack direction="row" spacing={1}>
						<IconButton color="inherit" href="mailto:your.email@example.com">
							<Mail size={20} />
						</IconButton>
						<IconButton
							color="inherit"
							href="https://linkedin.com/in/yourprofile"
						>
							<Linkedin size={20} />
						</IconButton>
						<IconButton color="inherit" href="https://github.com/yourprofile">
							<Github size={20} />
						</IconButton>
					</Stack>
				</Toolbar>
			</AppBar>

			{/* Hero Section */}
			<HeroSection>
				<Container maxWidth="lg">
					<Grid container spacing={6} alignItems="center">
						<Grid item xs={12} lg={6}>
							<Chip
								icon={<TrendingUp size={16} />}
								label="Seeking Quantitative Finance Opportunities"
								color="primary"
								variant="outlined"
								sx={{ mb: 3 }}
							/>

							<Typography variant="h1" color="text.primary" gutterBottom>
								Hi, I'm [Your Name]
							</Typography>

							<Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
								Business Analytics student at NUS with experience in AI
								development and algorithmic trading. I enjoy working with data
								and building systems that solve real problems.
							</Typography>

							<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
								<Button
									variant="contained"
									endIcon={<ChevronRight size={20} />}
									size="large"
								>
									View My Work
								</Button>
								<Button
									variant="outlined"
									endIcon={<ExternalLink size={20} />}
									size="large"
								>
									Resume
								</Button>
							</Stack>
						</Grid>

						<Grid item xs={12} lg={6}>
							<Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
								<Box textAlign="center" mb={3}>
									<Avatar
										sx={{
											width: 120,
											height: 120,
											mx: "auto",
											mb: 2,
											bgcolor: "grey.200",
											color: "text.secondary",
											fontSize: "0.875rem",
										}}
									>
										Photo
									</Avatar>
									<Typography variant="h4" gutterBottom>
										Your Name
									</Typography>
									<Typography variant="body1" color="text.secondary">
										NUS Business Analytics
									</Typography>
								</Box>

								<Grid container spacing={2}>
									<Grid item xs={6}>
										<MetricCard
											value="Y3"
											label="Current Year"
											icon={TrendingUp}
										/>
									</Grid>
									<Grid item xs={6}>
										<MetricCard
											value="SAP"
											label="AI Experience"
											icon={Brain}
										/>
									</Grid>
									<Grid item xs={6}>
										<MetricCard
											value="Full-Stack"
											label="Trading Bot"
											icon={Code2}
										/>
									</Grid>
									<Grid item xs={6}>
										<MetricCard
											value="Docker"
											label="Deployment"
											icon={Database}
										/>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</HeroSection>

			{/* Projects Section */}
			<Section bgcolor="background.paper">
				<Container maxWidth="lg">
					<Box textAlign="center" mb={8}>
						<Typography variant="h2" color="text.primary" gutterBottom>
							Recent Work
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							maxWidth="md"
							mx="auto"
						>
							What I've been working on lately
						</Typography>
					</Box>

					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<ProjectCard
								title="Trading Bot Development"
								description="Built a trading system over the summer with data processing, risk management, and backtesting. Learned a lot about market dynamics and system architecture."
								tech={[
									"Python",
									"Docker",
									"PostgreSQL",
									"Market Data",
									"Risk Management",
								]}
								type="Personal Project"
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<ProjectCard
								title="AI Development at SAP"
								description="Worked on frontend and backend development for AI applications during my Y2 summer. Gained experience with LLMs and building user interfaces for business applications."
								tech={[
									"React",
									"TypeScript",
									"Node.js",
									"LLMs",
									"API Integration",
								]}
								type="Internship"
							/>
						</Grid>
					</Grid>
				</Container>
			</Section>

			{/* Skills & Background Section */}
			<Section>
				<Container maxWidth="lg">
					<Grid container spacing={6}>
						<Grid item xs={12} md={4}>
							<Typography variant="h3" gutterBottom>
								Technical Skills
							</Typography>
							<Box>
								<SkillItem>Python, TypeScript, React</SkillItem>
								<SkillItem>Docker, PostgreSQL, MongoDB</SkillItem>
								<SkillItem>Financial APIs, Market Data</SkillItem>
								<SkillItem>Machine Learning, LLMs</SkillItem>
							</Box>
						</Grid>

						<Grid item xs={12} md={4}>
							<Typography variant="h3" gutterBottom>
								Areas of Interest
							</Typography>
							<Box>
								<SkillItem color="success">Quantitative Trading</SkillItem>
								<SkillItem color="success">Risk Management</SkillItem>
								<SkillItem color="success">Financial Data Analysis</SkillItem>
								<SkillItem color="success">System Architecture</SkillItem>
							</Box>
						</Grid>

						<Grid item xs={12} md={4}>
							<Typography variant="h3" gutterBottom>
								Currently
							</Typography>
							<StyledCard>
								<Typography variant="body1" color="text.primary" mb={2}>
									Final year student looking for opportunities in quantitative
									finance and algorithmic trading.
								</Typography>
								<Stack spacing={2}>
									<Box display="flex" alignItems="center">
										<Mail size={16} style={{ marginRight: 8 }} />
										<Typography variant="body2" color="primary.main">
											your.email@example.com
										</Typography>
									</Box>
									<Box display="flex" alignItems="center">
										<Phone size={16} style={{ marginRight: 8 }} />
										<Typography variant="body2" color="primary.main">
											+65 XXXX XXXX
										</Typography>
									</Box>
								</Stack>
							</StyledCard>
						</Grid>
					</Grid>
				</Container>
			</Section>

			{/* Footer */}
			<Box
				component="footer"
				sx={{ bgcolor: "secondary.main", color: "white", py: 6 }}
			>
				<Container maxWidth="lg">
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
						spacing={4}
					>
						<Grid item xs={12} md={8}>
							<Typography variant="h4" gutterBottom sx={{ color: "white" }}>
								Get in Touch
							</Typography>
							<Typography variant="body1" sx={{ color: "grey.400" }}>
								Always interested in discussing quantitative finance and new
								opportunities
							</Typography>
						</Grid>

						<Grid item xs={12} md={4}>
							<Stack
								direction="row"
								spacing={2}
								justifyContent={{
									xs: "center",
									md: "flex-end",
								}}
							>
								<IconButton
									sx={{
										color: "grey.400",
										"&:hover": { color: "white" },
									}}
								>
									<Mail size={24} />
								</IconButton>
								<IconButton
									sx={{
										color: "grey.400",
										"&:hover": { color: "white" },
									}}
								>
									<Linkedin size={24} />
								</IconButton>
								<IconButton
									sx={{
										color: "grey.400",
										"&:hover": { color: "white" },
									}}
								>
									<Github size={24} />
								</IconButton>
								<IconButton
									sx={{
										color: "grey.400",
										"&:hover": { color: "white" },
									}}
								>
									<Phone size={24} />
								</IconButton>
							</Stack>
						</Grid>
					</Grid>

					<Divider sx={{ my: 4, bgcolor: "grey.800" }} />

					<Typography
						variant="body2"
						textAlign="center"
						sx={{ color: "grey.400" }}
					>
						© 2025 Your Name. All rights reserved.
					</Typography>
				</Container>
			</Box>
		</ThemeProvider>
	);
};

export default Portfolio;
