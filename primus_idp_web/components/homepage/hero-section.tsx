"use client";
import { motion } from "motion/react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import Balancer from "react-wrap-balancer";
import {
	Brain,
	Search,
	MessageSquare,
	Sparkles,
	ArrowRight,
	Zap,
	Shield,
	Globe2,
	ChevronRight,
	Play
} from "lucide-react";
import { HeroDashboardPreview } from "./hero-dashboard-preview";

/* ═══════════════════════════════════════════════════════════════
   ANIMATED PARTICLE BACKGROUND COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const AnimatedBackground = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationId: number;
		let particles: Particle[] = [];

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		class Particle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			opacity: number;
			color: string;
			pulseSpeed: number;
			pulseOffset: number;

			constructor() {
				this.x = Math.random() * canvas!.width;
				this.y = Math.random() * canvas!.height;
				this.size = Math.random() * 2 + 0.5;
				this.speedX = (Math.random() - 0.5) * 0.3;
				this.speedY = (Math.random() - 0.5) * 0.3;
				this.opacity = Math.random() * 0.5 + 0.1;
				this.pulseSpeed = Math.random() * 0.02 + 0.01;
				this.pulseOffset = Math.random() * Math.PI * 2;

				// Colors: violet, purple, cyan
				const colors = [
					'139, 92, 246',  // violet-500
					'168, 85, 247',  // purple-500
					'6, 182, 212',   // cyan-500
					'99, 102, 241',  // indigo-500
				];
				this.color = colors[Math.floor(Math.random() * colors.length)];
			}

			update(time: number) {
				this.x += this.speedX;
				this.y += this.speedY;

				// Pulse effect
				const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.3 + 0.7;
				this.opacity = (Math.random() * 0.3 + 0.2) * pulse;

				// Wrap around edges
				if (this.x < 0) this.x = canvas!.width;
				if (this.x > canvas!.width) this.x = 0;
				if (this.y < 0) this.y = canvas!.height;
				if (this.y > canvas!.height) this.y = 0;
			}

			draw() {
				if (!ctx) return;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
				ctx.fill();
			}
		}

		const initParticles = () => {
			const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
			particles = [];
			for (let i = 0; i < particleCount; i++) {
				particles.push(new Particle());
			}
		};

		const drawConnections = () => {
			if (!ctx) return;
			const maxDistance = 120;

			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < maxDistance) {
						const opacity = (1 - distance / maxDistance) * 0.15;
						ctx.beginPath();
						ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
						ctx.lineWidth = 0.5;
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}
		};

		let time = 0;
		const animate = () => {
			if (!ctx || !canvas) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			time += 1;

			// Draw and update particles
			particles.forEach(particle => {
				particle.update(time);
				particle.draw();
			});

			// Draw connections between nearby particles
			drawConnections();

			animationId = requestAnimationFrame(animate);
		};

		resizeCanvas();
		initParticles();
		animate();

		const handleResize = () => {
			resizeCanvas();
			initParticles();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full"
			style={{ opacity: 0.8 }}
		/>
	);
};

export function HeroSection() {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 md:px-8 md:py-32">
			{/* ═══════════════════════════════════════════════════════════════
			    PREMIUM ANIMATED VIDEO/PARTICLE BACKGROUND
			    ═══════════════════════════════════════════════════════════════ */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				{/* Base dark gradient */}
				<div className="absolute inset-0 bg-zinc-950" />

				{/* Animated particle canvas */}
				<AnimatedBackground />

				{/* Animated gradient orbs */}
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
						x: [0, 50, 0],
						y: [0, -30, 0]
					}}
					transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-violet-600/40 via-purple-600/30 to-fuchsia-600/20 rounded-full blur-[120px]"
				/>
				<motion.div
					animate={{
						scale: [1, 1.15, 1],
						opacity: [0.25, 0.4, 0.25],
						x: [0, -40, 0],
						y: [0, 40, 0]
					}}
					transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
					className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-500/35 via-sky-500/25 to-blue-500/15 rounded-full blur-[100px]"
				/>
				<motion.div
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.2, 0.35, 0.2]
					}}
					transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
					className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] bg-gradient-to-tr from-emerald-500/25 via-teal-500/15 to-cyan-500/10 rounded-full blur-[100px]"
				/>

				{/* Overlay gradient for text readability */}
				<div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/30 to-zinc-950/70" />

				{/* Animated grid pattern */}
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: `
							linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px),
							linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)
						`,
						backgroundSize: '60px 60px'
					}}
				/>

				{/* Top fade */}
				<div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-zinc-950 to-transparent" />

				{/* Bottom fade */}
				<div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />
			</div>

			{/* ═══════════════════════════════════════════════════════════════
			    MAIN CONTENT (SPLIT LAYOUT)
			    ═══════════════════════════════════════════════════════════════ */}
			<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl">
				{/* LEFT COLUMN: TEXT & CTA */}
				<div className="flex flex-col items-start text-left">
					{/* Announcement Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="mb-8"
					>
						<Link
							href="https://github.com/khanakkijpr-dot/Primus-IDP"
							target="_blank"
							className="group inline-flex items-center gap-2 px-1 pr-4 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-violet-700 backdrop-blur-sm transition-colors"
						>
							<span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white">
								NEW
							</span>
							<span className="text-sm text-zinc-400">
								100+ LLM Providers Supported
							</span>
							<ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
						</Link>
					</motion.div>

					{/* Main Heading */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
					>
						<Balancer>
							<span className="text-white">Your AI-Powered</span>
							<br />
							<span className="relative inline-block mt-2">
								<span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
									Command Center
								</span>
								<svg className="absolute -bottom-2 left-0 w-full h-3 text-violet-500/40" viewBox="0 0 100 12" preserveAspectRatio="none">
									<path d="M0,8 Q25,0 50,8 T100,8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
								</svg>
							</span>
						</Balancer>
					</motion.h1>

					{/* Subtitle */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl"
					>
						Unify your knowledge. Connect Slack, Notion, GitHub & 15+ tools.
						Search, chat, and generate insights with <span className="font-semibold text-white">enterprise-grade RAG</span>.
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="flex flex-col sm:flex-row items-center gap-4 mb-8"
					>
						<Link
							href="/register"
							className="group relative flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-base shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
						>
							<span>Start Building Free</span>
							<ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
						</Link>
						<Link
							href="/docs"
							className="group flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-zinc-900/80 backdrop-blur-sm text-white font-semibold text-base border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-300"
						>
							<Play className="w-4 h-4" />
							<span>View Demo</span>
						</Link>
					</motion.div>
				</div>

				{/* RIGHT COLUMN: 3D PREVIEW */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
					animate={{ opacity: 1, scale: 1, rotateY: 0 }}
					transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
					className="relative hidden lg:block perspective-1000"
				>
					<div className="relative z-10 transform tilt-in-fwd-tr transition-transform duration-500 hover:scale-[1.02]">
						<div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-2xl blur opacity-30 animate-pulse" />
						<div className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video group">
							<HeroDashboardPreview isDark={true} />
						</div>
					</div>
				</motion.div>
			</div>

			{/* Floating decorative elements (Retained but repositioned) */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1, delay: 1, ease: "easeOut" }}
				className="absolute right-[12%] top-[20%] hidden xl:block"
			>
				<div className="relative group">
					<div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
					<div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/25">
						<Brain className="w-8 h-8 text-white" />
					</div>
					<motion.div
						animate={{ y: [0, -8, 0] }}
						transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
						className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center"
					>
						<Sparkles className="w-4 h-4 text-white" />
					</motion.div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
				className="absolute left-[10%] top-[35%] hidden xl:block"
			>
				<div className="relative group">
					<div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
					<div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center shadow-xl shadow-cyan-500/25">
						<Search className="w-6 h-6 text-white" />
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
				className="absolute right-[15%] bottom-[30%] hidden xl:block"
			>
				<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
					<MessageSquare className="w-5 h-5 text-white" />
				</div>
			</motion.div>
		</div>
	);
}

const FeatureCard = ({
	icon: Icon,
	title,
	description,
	gradient,
	shadowColor
}: {
	icon: React.ElementType;
	title: string;
	description: string;
	gradient: string;
	shadowColor: string;
}) => {
	const shadowMap: Record<string, string> = {
		violet: "group-hover:shadow-violet-500/20",
		cyan: "group-hover:shadow-cyan-500/20",
		emerald: "group-hover:shadow-emerald-500/20"
	};

	return (
		<motion.div
			whileHover={{ y: -4, scale: 1.02 }}
			transition={{ duration: 0.2 }}
			className={`group relative p-6 rounded-2xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 shadow-sm hover:shadow-xl ${shadowMap[shadowColor]} transition-all duration-300`}
		>
			{/* Subtle gradient overlay on hover */}
			<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

			<div className="relative z-10">
				<div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 shadow-lg`}>
					<Icon className="w-5 h-5 text-white" />
				</div>
				<h3 className="text-lg font-semibold text-white mb-2">
					{title}
				</h3>
				<p className="text-zinc-400 text-sm leading-relaxed">
					{description}
				</p>
			</div>
		</motion.div>
	);
};

const StatItem = ({
	icon: Icon,
	label,
	value
}: {
	icon: React.ElementType;
	label: string;
	value: string;
}) => {
	return (
		<div className="flex items-center gap-3">
			<div className="w-12 h-12 rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 flex items-center justify-center">
				<Icon className="w-5 h-5 text-violet-400" />
			</div>
			<div>
				<p className="text-lg font-bold text-white">{value}</p>
				<p className="text-xs text-zinc-500">{label}</p>
			</div>
		</div>
	);
};


