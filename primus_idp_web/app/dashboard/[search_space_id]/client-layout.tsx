"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb";
import { AppSidebarProvider } from "@/components/sidebar/AppSidebarProvider";
import { ThemeTogglerComponent } from "@/components/theme/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLLMPreferences } from "@/hooks/use-llm-configs";

export function DashboardClientLayout({
	children,
	searchSpaceId,
	navSecondary,
	navMain,
}: {
	children: React.ReactNode;
	searchSpaceId: string;
	navSecondary: any[];
	navMain: any[];
}) {
	const t = useTranslations('dashboard');
	const router = useRouter();
	const pathname = usePathname();
	const searchSpaceIdNum = Number(searchSpaceId);

	const { loading, error, isOnboardingComplete } = useLLMPreferences(searchSpaceIdNum);
	const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

	// Skip onboarding check if we're already on the onboarding page
	const isOnboardingPage = pathname?.includes("/onboard");

	const [open, setOpen] = useState<boolean>(() => {
		try {
			const match = document.cookie.match(/(?:^|; )sidebar_state=([^;]+)/);
			if (match) return match[1] === "true";
		} catch {
			// ignore
		}
		return true;
	});

	useEffect(() => {
		// Skip check if already on onboarding page
		if (isOnboardingPage) {
			setHasCheckedOnboarding(true);
			return;
		}

		// Only check once after preferences have loaded
		if (!loading && !hasCheckedOnboarding) {
			const onboardingComplete = isOnboardingComplete();

			if (!onboardingComplete) {
				router.push(`/dashboard/${searchSpaceId}/onboard`);
			}

			setHasCheckedOnboarding(true);
		}
	}, [
		loading,
		isOnboardingComplete,
		isOnboardingPage,
		router,
		searchSpaceId,
		hasCheckedOnboarding,
	]);

	// Show loading screen while checking onboarding status (only on first load)
	if (!hasCheckedOnboarding && loading && !isOnboardingPage) {
		return (
			<div className="relative flex flex-col items-center justify-center min-h-screen">
				{/* Premium Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_70%)]" />

				{/* Animated Orbs */}
				<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

				<Card className="relative z-10 w-[350px] bg-zinc-900/80 backdrop-blur-xl rounded-2xl border-zinc-800/50 shadow-2xl shadow-violet-500/5">
					<CardHeader className="pb-2">
						<CardTitle className="text-xl font-semibold text-white">{t('loading_config')}</CardTitle>
						<CardDescription className="text-zinc-400">{t('checking_llm_prefs')}</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-center py-6">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full blur-lg opacity-50 animate-pulse" />
							<Loader2 className="relative h-10 w-10 text-violet-400 animate-spin" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Show error screen if there's an error loading preferences (but not on onboarding page)
	if (error && !hasCheckedOnboarding && !isOnboardingPage) {
		return (
			<div className="relative flex flex-col items-center justify-center min-h-screen">
				{/* Premium Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.1),transparent_70%)]" />

				<Card className="relative z-10 w-[400px] bg-zinc-900/80 backdrop-blur-xl rounded-2xl border-rose-500/30 shadow-2xl shadow-rose-500/10">
					<CardHeader className="pb-2">
						<CardTitle className="text-xl font-semibold text-rose-400">
							{t('config_error')}
						</CardTitle>
						<CardDescription className="text-zinc-400">{t('failed_load_llm_config')}</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-zinc-500">{error}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<SidebarProvider open={open} onOpenChange={setOpen}>
			{/* Use AppSidebarProvider which fetches user, search space, and recent chats */}
			<AppSidebarProvider
				searchSpaceId={searchSpaceId}
				navSecondary={navSecondary}
				navMain={navMain}
			/>
			<SidebarInset className="bg-[#0f0f11]">
				<header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-[#0f0f11]/95 backdrop-blur-xl border-b border-zinc-800/60">
					<div className="flex items-center justify-between w-full gap-3 px-4">
						<div className="flex items-center gap-3">
							<SidebarTrigger className="-ml-1 rounded-lg hover:bg-zinc-800/80 transition-colors text-zinc-400 hover:text-zinc-100" />
							<Separator orientation="vertical" className="h-5 bg-zinc-800" />
							<DashboardBreadcrumb />
						</div>
						<div className="flex items-center gap-2">
							<ThemeTogglerComponent />
						</div>
					</div>
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
