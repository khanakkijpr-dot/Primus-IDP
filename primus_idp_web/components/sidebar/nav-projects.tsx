"use client";

import {
	ExternalLink,
	Folder,
	type LucideIcon,
	MoreHorizontal,
	RefreshCw,
	Search,
	Share,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarInput,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

// Map of icon names to their components
const actionIconMap: Record<string, LucideIcon> = {
	ExternalLink,
	Folder,
	Share,
	Trash2,
	MoreHorizontal,
	Search,
	RefreshCw,
};

interface ChatAction {
	name: string;
	icon: string;
	onClick: () => void;
}

interface ChatItem {
	name: string;
	url: string;
	icon: LucideIcon;
	id?: number;
	search_space_id?: number;
	actions?: ChatAction[];
}

export function NavProjects({ chats }: { chats: ChatItem[] }) {
	const t = useTranslations('sidebar');
	const { isMobile } = useSidebar();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [isDeleting, setIsDeleting] = useState<number | null>(null);

	const searchSpaceId = chats[0]?.search_space_id || "";

	// Memoized filtered chats
	const filteredChats = useMemo(() => {
		if (!searchQuery.trim()) return chats;

		return chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [chats, searchQuery]);

	// Handle chat deletion with loading state
	const handleDeleteChat = useCallback(async (chatId: number, deleteAction: () => void) => {
		setIsDeleting(chatId);
		try {
			await deleteAction();
		} finally {
			setIsDeleting(null);
		}
	}, []);

	// Enhanced chat item component
	const ChatItemComponent = useCallback(
		({ chat }: { chat: ChatItem }) => {
			const isDeletingChat = isDeleting === chat.id;

			return (
				<SidebarMenuItem key={chat.id ? `chat-${chat.id}` : `chat-${chat.name}`}>
					<SidebarMenuButton
						onClick={() => router.push(chat.url)}
						disabled={isDeletingChat}
						className={`text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 rounded-lg transition-colors mx-1 ${isDeletingChat ? "opacity-50" : ""}`}
					>
						<chat.icon className="h-4 w-4" />
						<span className={isDeletingChat ? "opacity-50" : ""}>{chat.name}</span>
					</SidebarMenuButton>

					{chat.actions && chat.actions.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover className="text-zinc-500 hover:text-white">
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48 bg-zinc-900/95 backdrop-blur-xl border-zinc-800/50"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								{chat.actions.map((action, actionIndex) => {
									const ActionIcon = actionIconMap[action.icon] || Folder;
									const isDeleteAction = action.name.toLowerCase().includes("delete");

									return (
										<DropdownMenuItem
											key={`${action.name}-${actionIndex}`}
											onClick={() => {
												if (isDeleteAction) {
													handleDeleteChat(chat.id || 0, action.onClick);
												} else {
													action.onClick();
												}
											}}
											disabled={isDeletingChat}
											className={`${isDeleteAction ? "text-rose-400 focus:text-rose-400" : "text-zinc-300"} focus:bg-zinc-800/50`}
										>
											<ActionIcon className="h-4 w-4 text-zinc-500" />
											<span>{isDeletingChat && isDeleteAction ? "Deleting..." : action.name}</span>
										</DropdownMenuItem>
									);
								})}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</SidebarMenuItem>
			);
		},
		[isDeleting, router, isMobile, handleDeleteChat]
	);

	// Show search input if there are chats
	const showSearch = chats.length > 0;

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-1">{t('recent_chats')}</SidebarGroupLabel>

			{/* Search Input */}
			{showSearch && (
				<div className="px-3 pb-2">
					<SidebarInput
						placeholder={t('search_chats')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="h-8 bg-zinc-900/80 border-zinc-700/50 text-zinc-300 placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-lg"
					/>
				</div>
			)}

			<SidebarMenu>
				{/* Chat Items */}
				{filteredChats.length > 0 ? (
					filteredChats.map((chat) => <ChatItemComponent key={chat.id || chat.name} chat={chat} />)
				) : (
					/* No results state */
					<SidebarMenuItem>
						<SidebarMenuButton disabled className="text-zinc-500 mx-1">
							<Search className="h-4 w-4" />
							<span>{searchQuery ? t('no_chats_found') : t('no_recent_chats')}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}

				{/* View All Chats */}
				{chats.length > 0 && (
					<SidebarMenuItem>
						<SidebarMenuButton onClick={() => router.push(`/dashboard/${searchSpaceId}/chats`)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 rounded-lg mx-1">
							<MoreHorizontal className="h-4 w-4" />
							<span>{t('view_all_chats')}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}


