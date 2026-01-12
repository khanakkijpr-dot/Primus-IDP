"use client";

import {
	AlertCircle,
	BookOpen,
	Cable,
	ExternalLink,
	FileStack,
	FileText,
	Info,
	type LucideIcon,
	MessageCircleMore,
	Podcast,
	Settings2,
	SquareLibrary,
	SquareTerminal,
	Trash2,
	Undo2,
} from "lucide-react";
import { memo, useMemo } from "react";

import { Logo } from "@/components/Logo";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

// Map of icon names to their components
export const iconMap: Record<string, LucideIcon> = {
	BookOpen,
	Cable,
	FileStack,
	Undo2,
	MessageCircleMore,
	Settings2,
	SquareLibrary,
	SquareTerminal,
	AlertCircle,
	Info,
	ExternalLink,
	Trash2,
	Podcast,
	FileText,
};

const defaultData = {
	user: {
		name: "Primus Hub",
		email: "m@example.com",
		avatar: "/logo.svg",
	},
	navMain: [
		{
			title: "Chat",
			url: "#",
			icon: "MessageSquare",
			isActive: true,
			items: [],
		},
		{
			title: "LLMs",
			url: "#",
			icon: "Settings2",
			items: [],
		},
		{
			title: "Documents",
			url: "#",
			icon: "FileStack",
			items: [
				{
					title: "Upload Documents",
					url: "#",
				},
				{
					title: "Manage Documents",
					url: "#",
				},
			],
		},
		{
			title: "Connectors",
			url: "#",
			icon: "Cable",
			items: [
				{
					title: "Add Connector",
					url: "#",
				},
				{
					title: "Manage Connectors",
					url: "#",
				},
			],
		},
		{
			title: "Logs",
			url: "#",
			icon: "FileText",
			items: [],
		},
	],
	navSecondary: [
		{
			title: "WORKSPACE",
			url: "#",
			icon: "LifeBuoy",
		},
	],
	RecentChats: [
		{
			name: "Design Engineering",
			url: "#",
			icon: "MessageCircleMore",
			id: 1001,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: "MessageCircleMore",
			id: 1002,
		},
		{
			name: "Travel",
			url: "#",
			icon: "MessageCircleMore",
			id: 1003,
		},
	],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	navMain?: {
		title: string;
		url: string;
		icon: string;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
	navSecondary?: {
		title: string;
		url: string;
		icon: string;
	}[];
	RecentChats?: {
		name: string;
		url: string;
		icon: string;
		id?: number;
		search_space_id?: number;
		actions?: {
			name: string;
			icon: string;
			onClick: () => void;
		}[];
	}[];
	user?: {
		name: string;
		email: string;
		avatar: string;
	};
}

// Memoized AppSidebar component for better performance
export const AppSidebar = memo(function AppSidebar({
	navMain = defaultData.navMain,
	navSecondary = defaultData.navSecondary,
	RecentChats = defaultData.RecentChats,
	...props
}: AppSidebarProps) {
	// Process navMain to resolve icon names to components
	const processedNavMain = useMemo(() => {
		return navMain.map((item) => ({
			...item,
			icon: iconMap[item.icon] || SquareTerminal,
		}));
	}, [navMain]);

	// Process navSecondary to resolve icon names to components
	const processedNavSecondary = useMemo(() => {
		return navSecondary.map((item) => ({
			...item,
			icon: iconMap[item.icon] || Undo2,
		}));
	}, [navSecondary]);

	// Process RecentChats to resolve icon names to components
	const processedRecentChats = useMemo(() => {
		return (
			RecentChats?.map((item) => ({
				...item,
				icon: iconMap[item.icon] || MessageCircleMore,
			})) || []
		);
	}, [RecentChats]);

	return (
		<Sidebar variant="inset" collapsible="icon" aria-label="Main navigation" className="border-r border-zinc-800/60 !bg-[#0a0a0b]" {...props}>
			<SidebarHeader className="pb-2 border-b border-zinc-800/40">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild aria-label="Go to home page" className="hover:bg-zinc-800/60 rounded-lg">
							<div className="flex items-center gap-3">
								<div className="relative flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25">
									<Logo className="rounded-lg" />
									<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/10" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold tracking-tight text-zinc-100">Primus IDP</span>
									<span className="truncate text-xs text-zinc-500">beta v0.0.1</span>
								</div>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="space-y-4 px-2 py-3">
				<NavMain items={processedNavMain} />

				{processedRecentChats.length > 0 && (
					<div className="space-y-2 pt-2">
						<NavProjects chats={processedRecentChats} />
					</div>
				)}
			</SidebarContent>
			<SidebarFooter className="pt-3 border-t border-zinc-800/40 pb-2">
				<NavSecondary items={processedNavSecondary} className="mt-auto" />
			</SidebarFooter>
		</Sidebar>
	);
});


