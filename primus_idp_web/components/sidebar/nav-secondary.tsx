"use client";

import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import { useMemo } from "react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavSecondaryItem {
	title: string;
	url: string;
	icon: LucideIcon;
}

export function NavSecondary({
	items,
	...props
}: {
	items: NavSecondaryItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	// Display names mapping
	const displayNames: Record<string, string> = {
		'All Workspaces': 'All Workspaces',
		'WORKSPACE': 'Workspace',
	};

	const getDisplayName = (title: string): string => {
		return displayNames[title] || title;
	};

	// Memoize items to prevent unnecessary re-renders
	const memoizedItems = useMemo(() => items, [items]);

	return (
		<SidebarGroup {...props}>
			<SidebarGroupLabel className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-1">Workspace</SidebarGroupLabel>
			<SidebarMenu>
				{memoizedItems.map((item, index) => {
					const displayTitle = getDisplayName(item.title);
					return (
						<SidebarMenuItem key={`${item.title}-${index}`}>
							<SidebarMenuButton asChild size="sm" aria-label={displayTitle} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 rounded-lg transition-colors mx-1">
								<a href={item.url}>
									<item.icon className="h-4 w-4" />
									<span>{displayTitle}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}


