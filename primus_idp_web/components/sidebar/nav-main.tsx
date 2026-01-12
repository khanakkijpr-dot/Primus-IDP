"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useMemo } from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavItem {
	title: string;
	url: string;
	icon: LucideIcon;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
}

export function NavMain({ items }: { items: NavItem[] }) {
	// Use direct display names - translations can be added later if i18n is properly configured
	const displayNames: Record<string, string> = {
		'Researcher': 'Chat',
		'Chat': 'Chat',
		'Manage LLMs': 'LLMs',
		'LLMs': 'LLMs',
		'Documents': 'Documents',
		'Upload Documents': 'Upload Documents',
		'Add Webpages': 'Add Webpages',
		'Add Youtube Videos': 'Add Youtube Videos',
		'Manage Documents': 'Manage Documents',
		'Connectors': 'Connectors',
		'Add Connector': 'Add Connector',
		'Manage Connectors': 'Manage Connectors',
		'Logs': 'Logs',
		'Platform': 'Platform',
	};

	// Get display name or fallback to original title
	const getDisplayName = (title: string): string => {
		return displayNames[title] || title;
	};

	// Memoize items to prevent unnecessary re-renders
	const memoizedItems = useMemo(() => items, [items]);

	return (
		<SidebarGroup>
			<SidebarGroupLabel className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-1">{getDisplayName('Platform')}</SidebarGroupLabel>
			<SidebarMenu>
				{memoizedItems.map((item, index) => {
					const displayTitle = getDisplayName(item.title);
					return (
						<Collapsible key={`${item.title}-${index}`} asChild defaultOpen={item.isActive}>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									tooltip={displayTitle}
									isActive={item.isActive}
									aria-label={`${displayTitle}${item.items?.length ? " with submenu" : ""}`}
									className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 data-[active=true]:bg-violet-500/15 data-[active=true]:text-violet-300 rounded-lg transition-all duration-150 mx-1"
								>
									<a href={item.url}>
										<item.icon className="h-4 w-4" />
										<span>{displayTitle}</span>
									</a>
								</SidebarMenuButton>

								{item.items?.length ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction
												className="data-[state=open]:rotate-90 transition-transform duration-200 text-zinc-500 hover:text-zinc-300"
												aria-label={`Toggle ${displayTitle} submenu`}
											>
												<ChevronRight className="h-4 w-4" />
												<span className="sr-only">Toggle submenu</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>
										<CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 duration-200">
											<SidebarMenuSub className="border-l border-zinc-700/50 ml-4">
												{item.items?.map((subItem, subIndex) => {
													const displaySubTitle = getDisplayName(subItem.title);
													return (
														<SidebarMenuSubItem key={`${subItem.title}-${subIndex}`}>
															<SidebarMenuSubButton asChild aria-label={displaySubTitle} className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors rounded-md">
																<a href={subItem.url}>
																	<span>{displaySubTitle}</span>
																</a>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								) : null}
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}


